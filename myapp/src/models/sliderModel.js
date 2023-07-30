const mongoose = require("mongoose");

const sliderSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
    },
    content: String,
    ordering: Number,
    status: String,
    thumb: String,
    special: String,
    slug: String,
    href: String,
  },
  { timestamps: true }
);

sliderSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = generateSlug(this.name);
  }
  next();
});

function generateSlug(name) {
  let slug = name
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");

  return slug;
}

module.exports = mongoose.model("Slider", sliderSchema);
