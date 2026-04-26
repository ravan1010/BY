
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    name: String ,
    description : String,
    images: [String],
    price: Number,
    mrp: Number,
    why: [String],
    includes: [String],
    reviews: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
            rating: { type: Number, required: true },
            comment: { type: String },
        }
    ],
});

const eventPostSchema = new mongoose.Schema({
    VendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    eventName: String,
    EventType: String,
    variantname: String,
    variants: [
        variantSchema
    ],
    status:{
        type: String,
        require: true,
        enum: ['normal','home','ads'],
        default:"normal",
    },
});

const EventPostDATA = mongoose.models.EventPost || mongoose.model("EventPost", eventPostSchema);

export default EventPostDATA;
