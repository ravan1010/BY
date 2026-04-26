import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
    VendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true
    },
    EventPostID : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EventPost',
        required: true
    },
    VariantID : String,
    UserMobile : Number,
    date : Date,
    ProgressOTP : Number,
    completeOTP : Number,
    status:{
        type: String,
        require: true,
        enum: ['pending','accepted','progress','complete','cancel'],
        default:"pending",
    },
});

const BookingDATA = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default BookingDATA;
