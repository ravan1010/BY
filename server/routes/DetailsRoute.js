import { Router } from "express";
const router = Router()
import vendorDATA from "../models/vendorModel.js";
import dotenv from "dotenv"
import { authenticateToken } from "../middleware/auth.js";
dotenv.config()

router.get('/details/check', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const Vendor = await vendorDATA.findById(userId);
    if (!Vendor) {
        return res.status(404).json({ message: "Vendor not found" });
    }

    if (!Vendor.description || !Vendor.address || !Vendor.eventName || !Vendor.phone || Vendor.location.coordinates[0] === 0 || Vendor.location.coordinates[1] === 0) {
        return res.status(200).json({ Vendor: Vendor, success: false });
    }

    return res.status(200).json({ Vendor: Vendor, success: true });
});

router.post('/details', authenticateToken, async (req, res) => {
    const VendorId = req.user.id; // Assuming you have user authentication in place
    const { description, address, eventName, phone, lat, lng } = req.body;
    console.log(eventName, phone, description, address, lat, lng, VendorId);
    
    if (!description || !address || !eventName || !phone || !lat || !lng) {
        return res.status(400).json({ message: "All fields are required" });
    }

    await vendorDATA.findByIdAndUpdate(
        VendorId,
        {
            description,
            address,
            eventName,
            phone,
            location: {
                type: "Point",
                coordinates: [lng, lat],
            },
        },
        )
                    
      res.status(200).json({ message: "Details updated successfully", success: true });

})

router.get("/vendor/availability", authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id;
    const vendor = await vendorDATA.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    res.json({ availableDates: vendor.availableDates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/vendor/availability/update", authenticateToken, async (req, res) => {
  try {
    const vendorId = req.user.id;
    console.log(vendorId)
    let { availableDates } = req.body;

    console.log(req.body)

    // ✅ Normalize all dates
    const formattedDates = (availableDates || []).map(
      (d) => new Date(d).toISOString().split("T")[0]
    );

    console.log(formattedDates)

    const vendor = await vendorDATA.findByIdAndUpdate(
      vendorId,
      { availableDates: formattedDates },
      { returnDocument: "after" }
    );

    res.json({
      success: true,
      message: "Availability updated",
      availableDates: vendor.availableDates,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/vendor/fcmToken", authenticateToken, async (req, res) => {

  try {
    const id = req.user.id
    const { fcmToken } = req.body;
    console.log(typeof fcmToken, 'id :', id)

    if (!fcmToken) {
      return res.status(400).json({ success: false });
    }

    await vendorDATA.findByIdAndUpdate(id, {
      VendorfcmToken: fcmToken,
    });

  } catch (error) {
    res.status(500).json(error)
  }
})

export default router