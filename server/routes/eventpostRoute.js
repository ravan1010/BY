import { Router } from "express";
const router = Router()
import EventPostDATA from "../models/eventpostModel.js";
import dotenv from "dotenv"
import { authenticateToken } from "../middleware/auth.js";
import vendorDATA from "../models/vendorModel.js";
dotenv.config()

// vendor active
router.get('/active', authenticateToken, async (req, res) => {

    const id = req.user.id;
    const vendor = await vendorDATA.findById(id)

    if(vendor.active === true){
        return res.json({ success : true })
    }

    res.json({ success : false })
})

// Create a new event post
router.post('/eventpost', authenticateToken, async (req, res) => {
    const VendorId = req.user.id;
    const { eventName, EventType, variantname, variants } = req.body;

    if (!eventName || !EventType || !variantname || !variants ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const newEventPost = new EventPostDATA({
        VendorId,
        eventName,
        EventType,
        variantname,
        variants,
    });

    await newEventPost.save();

    const vendor = await vendorDATA.findById(VendorId);
    vendor.eventPosts.push(newEventPost._id);
    await vendor.save();
    

    res.status(201).json({ message: "Event post created successfully", success: true });
})

// Get all event posts for the authenticated vendor
router.get('/eventposts', authenticateToken, async (req, res) => {
    const VendorId = req.user.id;
    const eventPosts = await EventPostDATA.find({ VendorId });
    res.status(200).json({ eventPosts });
})

// Get a single event post by ID
router.get("/event/:id", async (req, res) => {
  const event = await EventPostDATA.findById(req.params.id);
  res.json(event);
});

// Update an event post
router.put('/eventpost/:id', authenticateToken, async (req, res) => {
    const VendorId = req.user.id;
    const { id } = req.params;
    const { eventName, EventType, variantname, variants, status } = req.body;

    const eventPost = await EventPostDATA.findById(id);
    if (!eventPost) {
        return res.status(404).json({ message: "Event post not found" });
    }

    if (eventPost.VendorId.toString() !== VendorId) {
        return res.status(403).json({ message: "Unauthorized to update this event post" });
    }

    eventPost.eventName = eventName;
    eventPost.EventType = EventType;
    eventPost.variantname = variantname;
    eventPost.variants = variants;
    eventPost.status = status;

    await eventPost.save();
    res.status(200).json({ message: "Event post updated successfully", success: true });
});

// Delete an event post
router.delete('/eventpost/:id', authenticateToken, async (req, res) => {
    const VendorId = req.user.id;
    const { id } = req.params;

    const eventPost = await EventPostDATA.findById(id);
    if (!eventPost) {
        return res.status(404).json({ message: "Event post not found" });
    }
    
    if (eventPost.VendorId.toString() !== VendorId) {
        return res.status(403).json({ message: "Unauthorized to delete this event post" });
    }

    await EventPostDATA.findByIdAndDelete(id);
    res.status(200).json({ message: "Event post deleted successfully", success: true });
});

router.delete('/eventpost/:id/:variantId', authenticateToken, async (req, res) => {
    const VendorId = req.user.id;
    const { id, variantId } = req.params;

    const eventPost = await EventPostDATA.findById(id);
    if (!eventPost) {
        return res.status(404).json({ message: "Event post not found" });
    }

    if (eventPost.VendorId.toString() !== VendorId) {
        return res.status(403).json({ message: "Unauthorized to delete this event post" });
    }

    eventPost.variants = eventPost.variants.filter(v => v._id.toString() !== variantId);
    await eventPost.save();
    res.status(200).json({ message: "Variant deleted successfully", success: true });
});

export default router