import { Router } from "express";
const router = Router()
import dotenv from "dotenv"
import { authToken } from "../../middleware/auth.js";
import vendorDATA from "../../models/vendorModel.js";
dotenv.config()

router.get('/profile', authToken, async (req, res) => {
    const user = req.UA.id;

    const userData = await vendorDATA.findById(user);
    if (!userData) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ email: userData.email });
})

export default router;