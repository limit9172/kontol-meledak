document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
        let response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        let result = await response.json();
        if (result.success) {
            alert("Login berhasil! (Simulasi)");
        } else {
            alert("Gagal login!");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
