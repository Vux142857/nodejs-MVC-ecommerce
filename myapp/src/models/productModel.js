const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
    },
    category: String,
    slug: String,
    img: [String],
    size: [
      {
        name: String,
        amount: Number,
      },
    ],
    color: [String],
    price: Number,
    description: String,
    remain: Number,
    status: String,
    sale: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
