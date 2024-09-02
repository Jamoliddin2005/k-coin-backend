const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Yangi foydalanuvchini yaratish yoki mavjud foydalanuvchini yangilash
router.post("/create", async (req, res) => {
  const { userId, username, firstName, lastName } = req.body;
  try {
    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({ userId, username, firstName, lastName });
      await user.save();
      res.status(201).json({ message: "User added", user });
    } else {
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      await user.save();
      res.json({ message: "User updated", user });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error: ", error: err.message });
  }
});

// Foydalanuvchining balansini olish
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error: ", error: err.message });
  }
});

// Foydalanuvchining balansini yangilash
router.post("/:userId/increment", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { $inc: { balance: 1 } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error: ", error: err.message });
  }
});

// Referalni qo'shish
router.post("/:userId/addFriend", async (req, res) => {
  const { friendId, friendUsername } = req.body;
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ message: "User not found!" });

    const friend = await User.findOne({ userId: friendId });
    if (!friend) return res.status(404).json({ message: "Friend not found!" });

    // Foydalanuvchi do'stlar ro'yxatiga qo'shiladi
    user.friends.push({
      userId: friendId,
      username: friendUsername,
      balance: friend.balance,
    });
    await user.save();

    res.json({ message: "Friend added", user });
  } catch (err) {
    res.status(500).json({ message: "Server error: ", error: err.message });
  }
});

// Do'stlarni ko'rsatish
router.get("/:userId/friends", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: "Server error: ", error: err.message });
  }
});

// Foydalanuvchining balansiga 1000 coin qo'shish
router.post("/:userId/addBonus", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { userId: req.params.userId },
      { $inc: { balance: 1000 } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error: ", error: err.message });
  }
});


module.exports = router;
