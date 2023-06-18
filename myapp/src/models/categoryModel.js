const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A category must have a name"],
      unique: true,
    },
    ordering: {
      type: Number,
    },
    status: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Categories", categorySchema);
