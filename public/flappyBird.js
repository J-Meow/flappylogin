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
    bird: imageAsset("yellowbird-upflap"),
}
let groundTick = 0
let lastUpdate = Date.now()
const bird = {
    y: 500,
    yVelocity: 0,
    dead: false,
}
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
    ctx.save()
    ctx.translate(50, canvas.height - bird.y)
    ctx.rotate(Math.min(-bird.yVelocity * 2, Math.PI / 2))
    ctx.drawImage(assets.bird, -17, -12)
    ctx.restore()
}
function update() {
    const millisecondsSinceUpdate = Date.now() - lastUpdate
    const movementX = millisecondsSinceUpdate / 4
    groundTick = (groundTick + movementX) % 24
    lastUpdate = Date.now()
    bird.y += bird.yVelocity * millisecondsSinceUpdate
    bird.yVelocity -= millisecondsSinceUpdate / 800
    if (bird.y <= 128) {
        bird.dead = true
        bird.y = 128
        bird.yVelocity = -100
        return
    }
    setTimeout(update, 1000 / 60)
}
addEventListener("keydown", (ev) => {
    if (!bird.dead && ev.code == "Space") {
        bird.yVelocity = 0.4
    }
})
