const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userSchema = mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next(); //arrow function ko nhận đc this !!!!!!!!!!!!
  user.password = await bcrypt.hash(user.password, saltRounds);
  next();
});
module.exports = mongoose.model("User", userSchema);
