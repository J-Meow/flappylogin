const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")
function imageAsset(name) {
    const elem = document.createElement("img")
    elem.src = "/assets/sprites/" + name + ".png"
    return elem
}
const assets = {
    base: imageAsset("base"),
    dayBG: imageAsset("background-day"),
}
let groundTick = 0
let lastUpdate = Date.now()
function draw() {
    requestAnimationFrame(draw)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i <= Math.ceil(canvas.width / 288); i++) {
        ctx.drawImage(assets.dayBG, i * 288, canvas.height - 512)
    }
    ctx.fillStyle = "#4dc1cb"
    ctx.fillRect(0, 0, canvas.width, canvas.height - 512)
    for (let i = 0; i <= Math.ceil(canvas.width / 336); i++) {
        ctx.drawImage(
            assets.base,
            -Math.floor(groundTick) + i * 336,
            canvas.height - 112,
        )
    }
}
function update() {
    const millisecondsSinceUpdate = Date.now() - lastUpdate
    const movementX = millisecondsSinceUpdate / 4
    groundTick = (groundTick + movementX) % 24
    lastUpdate = Date.now()
    setTimeout(update, 1000 / 60)
}
draw()
update()
