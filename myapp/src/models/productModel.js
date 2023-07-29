const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
    },
    category: String,
    slug: {
      type: String,
      unique: true,
    },
    img: [String],
    size: [
      {
        id: String,
        name: String,
        amount: Number,
        sold: { type: Number, default: 0 },
      },
    ],
    remain: Number,
    color: String,
    price: Number,
    description: String,
    status: String,
    sale: Number,
    special: String,
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = generateSlug(this.name);
  }
  this.remain = generateRemain(this.size);
  next();
});

function generateRemain(size) {
  let remain = 0;
  if (size && size.length > 0) {
    size.forEach((element) => {
      remain += element.amount;
    });
  }
  return remain;
}

function generateSlug(name) {
  let slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  return slug;
}

module.exports = mongoose.model("Product", productSchema);
