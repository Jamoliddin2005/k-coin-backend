const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  balance: { type: Number, default: 0 },
  friends: [{ userId: String, username: String, balance: Number }],  
});

const User = mongoose.model("User", userSchema);

module.exports = User;
