import { Router } from "express";
const router = Router()
import dotenv from "dotenv"
import { authToken } from "../../middleware/auth.js";
import vendorDATA from "../../models/vendorModel.js";
import EventPostDATA from "../../models/eventpostModel.js";
import BookingDATA from "../../models/bookingModel.js";
import { sendPushNotification } from "../../config/firebase.js";
dotenv.config()

router.get('/vendors', async (req, res) => {
    try {
        const vendors = await vendorDATA.find({role: "vendor"});
        res.status(200).json(vendors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
}) 

export default router