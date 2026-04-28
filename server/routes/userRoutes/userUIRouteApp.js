import { Router } from "express";
const router = Router()
import dotenv from "dotenv"
import { authToken } from "../../middleware/auth.js";
import vendorDATA from "../../models/vendorModel.js";
import EventPostDATA from "../../models/eventpostModel.js";
import BookingDATA from "../../models/bookingModel.js";
import { sendPushNotification } from "../../config/firebase.js";
import { auth } from "../../middleware/auth.js";
dotenv.config()

router.get('/vendors', auth, async (req, res) => {
    try {
        const vendors = await vendorDATA.find({role: "vendor"});
        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
}) 

router.get('/profile', auth, async (req, res) => {
    const user = req.token;

    const userData = await vendorDATA.findById(user);
    if (!userData) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ email: userData.email });
})










router.get('/get/booking', auth, async (req, res) => {
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
export default router