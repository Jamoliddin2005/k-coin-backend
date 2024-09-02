const express = require("express");
const router = express.Router();
const axios = require("axios");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

// Foydalanuvchi obuna bo'lishini tekshirish
router.post("/checkSubscription", async (req, res) => {
  const { userId, chatId } = req.body; // chatId bu yerda foydalanuvchining chat ID sini bildiradi

  // Telegram API orqali foydalanuvchining obuna bo'lish holatini tekshirish
  const response = await axios.get(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMember`,
    {
      params: {
        chat_id: TELEGRAM_CHANNEL_ID,
        user_id: userId,
      },
    }
  );

  if (
    response.data.result.status === "member" ||
    response.data.result.status === "administrator"
  ) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

module.exports = router;
