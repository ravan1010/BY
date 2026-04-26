import { Router } from "express";
const router = Router()
import EventPostDATA from "../models/eventpostModel.js";
import dotenv from "dotenv"
import { authenticateToken } from "../middleware/auth.js";
import vendorDATA from "../models/vendorModel.js";
dotenv.config()


router.get('/vendor/dashboard', authenticateToken, async (req, res) => {
    const vendor = await vendorDATA.findById(req.user.id)
    console.log(vendor)

    if(!vendor){
        res.status(400).json({success: false})
    }

    res.status(200).json({vendor: vendor})
})




export default router