const mongoose = require("mongoose");
const { Schema } = mongoose;

const blockedDateSchema = new Schema({
  listing: { type: Schema.Types.ObjectId, ref: "Listing", required: true, index: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  note: { type: String, trim: true, maxlength: 300, default: "" }
}, { timestamps: true });

blockedDateSchema.index({ listing: 1, startDate: 1, endDate: 1 });
module.exports = mongoose.model("BlockedDate", blockedDateSchema);
