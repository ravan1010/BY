import { Router } from "express";
const router = Router()
import dotenv from "dotenv"
import vendorDATA from "../../models/vendorModel.js";

router.get('/vendor/data', async (req, res) => {
  try {
    console.log(
        'suas'
    )
    const vendors = await vendorDATA.find({ active: 'false' });
    console.log(vendors)

    if (vendors.length === 0) {
      return res.status(404).json({ message: 'No inactive vendors found' });
    }

    res.status(200).json(vendors);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/vendor/active/:id', async (req, res) => {
  try {
    const updatedVendor = await vendorDATA.findByIdAndUpdate(
      req.params.id,
      { $set: { active: true } },
      { new: true }
    );

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({
      message: 'Vendor activated successfully',
      vendor: updatedVendor
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;