const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "A user must have a name"],
    unique: true,
  },
  email: String,
  password: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  email: String,
  address: String,
  phone: String,
  phone: String,
  isAdmin: {
    type: String,
    default: "off",
  },
  status: {
    type: String,
    default: "active",
  },
});

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next(); //arrow function ko nhận đc this !!!!!!!!!!!!
  user.password = await bcrypt.hash(user.password, saltRounds);
  next();
});
module.exports = mongoose.model("User", userSchema);
