const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({

  name: {
    type: String,
    required: [true, "A item must have a name"],
  },
  ordering: {
    type: String,
  },
  status: {
    type: String,
  },
  
}, { timestamps: true });

module.exports = mongoose.model("Items", itemSchema);
