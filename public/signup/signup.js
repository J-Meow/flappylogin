document.getElementById("signup-form").addEventListener("submit", (ev) => {
    ev.preventDefault()
    if (
        document.getElementById("password").value !=
        document.getElementById("confirm-password").value
    ) {
        alert("Passwords do not match!")
        return
    }
    fetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
        }),
    })
})
