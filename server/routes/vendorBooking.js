import { Router } from "express";
const router = Router()
import EventPostDATA from "../models/eventpostModel.js";
import dotenv from "dotenv"
import { authenticateToken } from "../middleware/auth.js";
import vendorDATA from "../models/vendorModel.js";
import BookingDATA from "../models/bookingModel.js";
import{sendPushNotification }from "../config/firebase.js"
dotenv.config()

router.get('/vendor/booking', authenticateToken, async (req, res) => {
    try {
        const vendorId = req.user.id;

        const bookings = await BookingDATA
            .find({ VendorId : vendorId }) // ✅ get all bookings
            .populate("EventPostID")
            .populate("VendorId") 
            .populate("UserId")
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

router.post('/vendor/cancel/booking/:id', authenticateToken, async (req, res) => {
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

router.post('/vendor/booking/toProgress/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await BookingDATA.findById(req.params.id);

        // ✅ check booking exists
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        // ✅ generate OTP (secure)
        const otp = Math.floor(1000 + Math.random() * 9000);

        // ✅ update booking
        booking.status = "accepted";
        booking.ProgressOTP = otp;

        await booking.save();

        console.log(booking.UserId.UserfcmToken)
        console.log(booking)
        const user = await vendorDATA.findById(booking.UserId)
        const title = 'events';
        const body = 'Events accepted by Vendor';
        const url = 'https://byslot.online/booked' 

        await sendPushNotification(user.UserfcmToken, title, body, url )

        res.status(200).json({
            success: true,
            message: "Booking moved to progress",
            otp // ⚠️ remove in production
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

router.post('/vendor/booking/toProgress/verify/:id', authenticateToken, async (req, res) => {
    try {
        const { otp } = req.body;

        // ✅ find booking with id + otp
        const booking = await BookingDATA.findOne({
            _id: req.params.id,
            ProgressOTP: otp
        });

        if (!booking) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // ✅ optional: update status after verification
        booking.status = "progress";
        booking.ProgressOTP = null; // clear OTP after use

         // ✅ generate OTP (secure)
        const otp = Math.floor(1000 + Math.random() * 9000);

        // ✅ update booking
        booking.completeOTP = otp;

        await booking.save();

        const user = await vendorDATA.findById(booking.UserId)
        const title = 'events';
        const body = 'Events accepted by Vendor';
        const url = 'https://byslot.online/booked' 

        await sendPushNotification(user.UserfcmToken, title, body, url )

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

router.post('/vendor/booking/complete/verify/:id', authenticateToken, async (req, res) => {
    try {
        const { otp } = req.body;

        // ✅ find booking with id + otp
        const booking = await BookingDATA.findOne({
            _id: req.params.id,
            completeOTP: otp
        });

        if (!booking) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // ✅ optional: update status after verification
        booking.status = "complete";
        booking.completeOTP = null; // clear OTP after use

        await booking.save();

        const user = await vendorDATA.findById(booking.UserId)
        const title = 'events';
        const body = 'Events accepted by Vendor';
        const url = 'https://byslot.online/booked' 

        await sendPushNotification(user.UserfcmToken, title, body, url )

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

export default router;