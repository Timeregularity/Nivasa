const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookingSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1, max: 20 },
  totalPrice: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed", "expired"], default: "pending", index: true },
  leaseId: { type: String, default: null, index: true },
  leaseExpiresAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  notes: { type: String, trim: true, maxlength: 500, default: "" }
}, { timestamps: true });

bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1, status: 1 });
module.exports = mongoose.model("Booking", bookingSchema);
