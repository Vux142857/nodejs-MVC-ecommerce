const mongoose = require("mongoose");

const advertiseSchema = mongoose.Schema(
  { 
    name: String,
    content: String,
    ordering: Number,
    thumb: String,
    url: String,
    status: { type: String, default: "active" },
    position: String,
    created_at: { type: Date, default: Date.now },
    start_at: Date,
    expired_at: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advertisement", advertiseSchema);
