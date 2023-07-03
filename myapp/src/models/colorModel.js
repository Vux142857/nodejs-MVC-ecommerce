const mongoose = require("mongoose");

const colorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A color must have a name"],
      unique: true,
    },
    status: {
      type: String,
      default: "active",
    },
    hex: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("Color", colorSchema);
