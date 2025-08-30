document
    .getElementById("signup-form")
    .addEventListener("submit", async (ev) => {
        ev.preventDefault()
        if (
            document.getElementById("password").value !=
            document.getElementById("confirm-password").value
        ) {
            alert("Passwords do not match!")
            return
        }
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
            }),
        })
        const json = await res.json()
        if (!json.ok) {
            alert("Error: " + json.error)
        } else {
            alert("Account created")
        }
    })
