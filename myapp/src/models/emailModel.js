const mongoose = require("mongoose");
const emailSchema = mongoose.Schema(
  {
    name: String,
    status: String,
    ordering: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Email", emailSchema);
