const mongoose = require("mongoose");
// const categoryList = require("./category");
const articleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
    },
    ordering: Number,
    status: String,
    thumb: String,
    special: String,
    slug: String,
    category: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
