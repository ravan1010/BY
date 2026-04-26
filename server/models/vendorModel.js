
import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  avatar: String,
  phone: Number,
  eventName: String,
  description : String,
  address : String,
  role: {
    type: String,
    enum: ["user", "vendor"],
    default: "user",
  },
  active : {
    type : Boolean,
    default : false
  },
  location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0],
        },
    },
  eventPosts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventPost",
    },
  ],
  availableDates: [Date],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  VendorfcmToken: String,
  UserfcmToken: String,
  VendorBookings:  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
   UserBookings:  [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
  Revenue: {
    type: Number,
    default: 0
  },
  Commission: {
    type: Number,
    default: 0
  }
});

vendorSchema.index({ location: "2dsphere" });

const vendorDATA = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);

export default vendorDATA;
