const mongoose = require("mongoose");

const sizeSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A size must have a name"],
      unique: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Size", sizeSchema);
