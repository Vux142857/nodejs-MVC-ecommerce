const mongoose = require("mongoose");

const generateSlug = function (name) {
  return name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
};

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
    },
    ordering: Number,
    status: String,
    slug: {
      type: String,
      default: function () {
        return generateSlug(this.name);
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categorie", categorySchema);
