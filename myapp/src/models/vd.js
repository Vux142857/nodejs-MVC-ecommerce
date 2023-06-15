const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({

  name: {
    type: String,
    required: [true, "A item must have a name"],
    unique: true
  },
  ordering: {
    type: Number,
  }
  
}, { timestamps: true });

module.exports = mongoose.model("demo", itemSchema);
