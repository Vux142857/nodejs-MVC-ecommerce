const mongoose = require("mongoose");

const emailSchema = mongoose.Schema(
  {
    name: String,
    status: {
      type: String,
      default: "active"
    },
    ordering: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
