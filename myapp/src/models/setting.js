const mongoose = require("mongoose");

const settingSchema = mongoose.Schema({
  contain: String,
});

module.exports = mongoose.model("Setting", settingSchema);
