import { Router } from "express";
const router = Router()
import dotenv from "dotenv"
import { authToken } from "../../middleware/auth.js";
import vendorDATA from "../../models/vendorModel.js";
import EventPostDATA from "../../models/eventpostModel.js";
import BookingDATA from "../../models/bookingModel.js";
import { sendPushNotification } from "../../config/firebase.js";
dotenv.config()


router.put('/notifications/fcmToken', authToken, async (req, res) => {
    try {
        const userId = req.UA.id;
        const { fcmToken } = req.body;
        console.log("Received FCM token:", fcmToken);
        if (!fcmToken) {
            return res.status(400).json({ message: "FCM token is required" });
        }
        await vendorDATA.findByIdAndUpdate(userId, { UserfcmToken: fcmToken });
        res.status(200).json({ message: "FCM token updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/vendors', authToken, async (req, res) => {
    try {
        const vendors = await vendorDATA.find({role: "vendor", active : true, "eventPosts.0": { $exists: true }});
        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
}) 

router.get('/vendor/:id', authToken, async (req, res) => {
    try {
        const vendor = await vendorDATA.findById(req.params.id).populate('eventPosts');
        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }
        res.status(200).json(vendor);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}); 

router.get('/vendorPost/:id/:vendor', authToken, async (req, res) => {
    try {   
        const eventPosts = await EventPostDATA.findById(req.params.id);
        const vendor = await vendorDATA.findById(req.params.vendor);
        if (!eventPosts) {
            return res.status(404).json({ message: "Event posts not found" });
        }
        res.status(200).json({eventPosts: eventPosts, vendor: vendor});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/booking/:id/:vendor/:variant', authToken, async (req, res) => {
    try {
        const userId = req.UA.id;

        const { mobile, seletedDate } = req.body;

        // ✅ validate input
        if (!mobile || !seletedDate) {
            return res.status(400).json({ message: "Missing fields" });
        }

        // ✅ create booking
        const booking = new BookingDATA({
            VendorId: req.params.vendor,
            UserId: userId,
            EventPostID: req.params.id,
            VariantID: req.params.variant,
            UserMobile: mobile,
            date: seletedDate
        });

        await booking.save();

        // ✅ update USER bookings
        await vendorDATA.findByIdAndUpdate(userId, {
            $push: { UserBookings: booking._id }
        });

        // ✅ update VENDOR bookings
        const vendor = await vendorDATA.findByIdAndUpdate(req.params.vendor, {
            $push: { VendorBookings: booking._id }
        });

        const title = "new booking";
        const body = " you got a new booking please checkout "
        const url = "https://vendor.byslot.online/vendor/bookings"

        await sendPushNotification(vendor.VendorfcmToken, title, body, url  )

        res.status(201).json({
            message: "Event booked successfully",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Something went wrong",
            error
        });
    }
});

router.get('/get/booking', authToken, async (req, res) => {
    try {
        const userId = req.UA.id;

        const bookings = await BookingDATA
            .find({ UserId: userId }) // ✅ get all bookings
            .populate("EventPostID")
            .populate("VendorId") 
            // ✅ correct populate

        if (!bookings || bookings.length === 0) {
            return res.status(200).json([]); // return empty array
        }

        res.status(200).json(bookings);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch bookings",
            error
        });
    }
});

router.post('/cancel/booking/:id', authToken, async (req, res) => {
    try {
        const bookings = await BookingDATA.findById(req.params.id)

        if (!bookings) {
            return res.status(200).json([]); // return empty array
        }

        bookings.status = "cancel";
        await bookings.save()

        res.status(200).json({message: 'cancel successfully'});

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch bookings",
            error
        });
    }
});

export default router; 