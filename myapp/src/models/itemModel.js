const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A item must have a name"],
      unique: true,
    },
    ordering: Number,
    status: String,
    slug: String,
    img: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Items", itemSchema);
