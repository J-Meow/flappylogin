let username = ""
let flappying = false
document.getElementById("username-form").addEventListener("submit", (ev) => {
    ev.preventDefault()
    username = document.getElementById("username").value
    document.getElementById("username").disabled = true
    document.getElementById("username").nextElementSibling.disabled = true
    document.getElementById("password").disabled = false
    document.getElementById("password").focus()
    flappying = true
    document.getElementById("game").classList.remove("hidden")
    draw()
    lastUpdate = Date.now()
    update()
})
