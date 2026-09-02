const mongoose = require("mongoose");
const { Schema } = mongoose;

const availabilityLockSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true },
  date: { type: Date, required: true },
  leaseId: { type: String, required: true, index: true },
  kind: { type: String, enum: ["booking", "blocked"], required: true },
  booking: { type: Schema.Types.ObjectId, ref: "Booking", default: null },
  blockedDate: { type: Schema.Types.ObjectId, ref: "BlockedDate", default: null },
  expiresAt: { type: Date, default: null }
}, { timestamps: true });

availabilityLockSchema.index({ listing: 1, date: 1 }, { unique: true });
availabilityLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("AvailabilityLock", availabilityLockSchema);
