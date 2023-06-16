const mongoose = require("mongoose");
const categoryList = require("./category");
const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
    },
    parentID: categoryList._id,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Itemcategory", itemSchema);
