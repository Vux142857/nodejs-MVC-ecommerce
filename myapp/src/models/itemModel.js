const mongoose = require("mongoose");

const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A item must have a name"],
      unique: true,
    },
    ordering: {
      type: Number,
    },
    status: {
      type: String,
    },
    slug: {
      type: String,
    },
    imgURL: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Items", itemSchema);
