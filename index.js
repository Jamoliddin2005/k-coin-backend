const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { Telegraf } = require("telegraf");
dotenv.config();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "https://ko-coin-bot.netlify.app", // frontend'ning URL manzili
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
};

// Botga /start buyrug'ini berish
bot.start((ctx) => {
  ctx.reply(
    `
    Привет! Добро пожаловать в бот Ko-Coin 💰           

Запустите нашу игру, нажми кнопку «Играть». Выберите свое приключение и начните нажимать на экран, чтобы собирать монеты.   

Не забудьте пригласить друзей — вместе вы сможете зарабатывать еще больше!
    `,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Играть",
              web_app: { url: "https://ko-coin-bot.netlify.app/" },
            },
          ],
        ],
      },
    }
  );
});

bot.command("invite", (ctx) => {
  ctx.reply("Do'stingizni taklif qilish uchun quyidagi havolani yuboring:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Do'stingizni taklif qiling",
            url: "https://t.me/share/url?url=YOUR_REFERRAL_LINK", // Referral link o'zingizga mos ravishda qo'shing
          },
        ],
      ],
    },
  });
});

// Botni ishga tushirish
bot
  .launch()
  .then(() => {
    console.log("Start.");
  })
  .catch((err) => {
    console.error("Error:", err);
  });

app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDBga ulandi"))
  .catch((err) => console.log("MongoDBga ulanishda xatolik:", err));

// Routes
const balanceRoutes = require("./routes/balance");
const balanceRoutesBot = require("./routes/bot");
app.use("/api/balance", balanceRoutes);
app.use("/api", balanceRoutesBot);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT}-portda ishlamoqda`));
