const mongoose = require("mongoose");
const couponSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A coupon must have a name"],
    unique: true,
  },
  value: Number,
  created_at: { type: Date, default: Date.now },
  start_at: String,
  expired_at: String,
  amount: Number,
  used: {
    type: Number,
    default: 0,
  },
  condition: Number,
  status: {
    type: String,
    default: "active",
  },
});

module.exports = mongoose.model("Coupon", couponSchema);
