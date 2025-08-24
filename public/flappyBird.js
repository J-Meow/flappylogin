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
let gameStarted = false
let password = ""
function updatePassword() {
    document.getElementById("password").value = password
}
const groups = {
    alpha1: [
        { type: "char", char: "a" },
        { type: "char", char: "b" },
        { type: "char", char: "c" },
        { type: "char", char: "d" },
        { type: "char", char: "e" },
        { type: "char", char: "f" },
        { type: "char", char: "g" },
        { type: "changeZone", target: "alpha2", label: "more" },
    ],
    alpha2: [
        { type: "char", char: "h" },
        { type: "char", char: "i" },
        { type: "char", char: "j" },
        { type: "char", char: "k" },
        { type: "char", char: "l" },
        { type: "char", char: "m" },
        { type: "char", char: "n" },
        { type: "changeZone", target: "alpha3", label: "more" },
    ],
    alpha3: [
        { type: "char", char: "o" },
        { type: "char", char: "p" },
        { type: "char", char: "q" },
        { type: "char", char: "r" },
        { type: "char", char: "s" },
        { type: "char", char: "t" },
        { type: "char", char: "u" },
        { type: "changeZone", target: "alpha4", label: "more" },
    ],
    alpha4: [
        { type: "char", char: "v" },
        { type: "char", char: "w" },
        { type: "char", char: "x" },
        { type: "char", char: "y" },
        { type: "char", char: "z" },
    ],
}
const defaultZoneGroup = [
    { type: "changeZone", target: "alpha1", label: "abc" },
    { type: "backspace", label: "<---" },
]
function addZone(zones) {
    keyZones.push({ done: false, x: canvas.width, zones })
}
let keyZones = []
if (flappyMode == "login") addZone(defaultZoneGroup)
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
    keyZones.forEach((zone) => {
        zone.zones.forEach((subZone, i) => {
            ctx.fillStyle = "#2ba0a966"
            ctx.fillRect(
                zone.x,
                i * ((canvas.height - 112) / zone.zones.length),
                canvas.height - bird.y <
                    (i + 1) * ((canvas.height - 112) / zone.zones.length) &&
                    canvas.height - bird.y >
                        (i + 0) * ((canvas.height - 112) / zone.zones.length)
                    ? 80
                    : 60,
                (canvas.height - 112) / zone.zones.length,
            )
            ctx.fillStyle = "black"
            ctx.textAlign = "left"
            ctx.textBaseline = "bottom"
            let fontSize = 30
            let text = ""
            if (subZone.type == "char") {
                text = subZone.char
            }
            if ("label" in subZone) {
                text = subZone.label
            }
            ctx.font = fontSize + "px sans-serif"
            ctx.fillText(
                text,
                zone.x + 10,
                ((i + 1) * (canvas.height - 112)) / zone.zones.length - 10,
            )
        })
    })
    if (!gameStarted && flappyMode == "login") {
        ctx.fillStyle = "black"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.font = "60px sans-serif"
        ctx.fillText("Flappy Login", canvas.width / 2, canvas.height / 3)
        ctx.font = "40px sans-serif"
        ctx.fillText(
            "Enter your password by playing Flappy Bird.",
            canvas.width / 2,
            canvas.height / 3 + 60,
        )
        ctx.font = "30px sans-serif"
        ctx.fillText(
            "Press Space to start",
            canvas.width / 2,
            canvas.height / 2,
        )
        ctx.fillStyle = "#efe9a6"
        ctx.font = "20px sans-serif"
        ctx.textAlign = "left"
        ctx.textBaseline = "bottom"
        ctx.fillText(
            "yes i know this font doesn't fit i'll fix it later",
            2,
            canvas.height - 2,
        )
    }
}
function update() {
    const millisecondsSinceUpdate = Date.now() - lastUpdate
    const movementX = millisecondsSinceUpdate / 4
    groundTick = (groundTick + movementX) % 24
    lastUpdate = Date.now()
    if (gameStarted) {
        bird.y += bird.yVelocity * millisecondsSinceUpdate
        bird.yVelocity -= millisecondsSinceUpdate / 800
        if (bird.y <= 128) {
            bird.dead = true
            bird.y = 128
            bird.yVelocity = -100
            return
        }
        keyZones.forEach((zone) => {
            zone.x -= movementX
            if (!zone.done && zone.x <= 60) {
                zone.zones.forEach((subZone, i) => {
                    const activated =
                        canvas.height - bird.y <
                            (i + 1) *
                                ((canvas.height - 112) / zone.zones.length) &&
                        canvas.height - bird.y >
                            (i + 0) *
                                ((canvas.height - 112) / zone.zones.length)
                    if (activated) {
                        console.log(subZone)
                        if (subZone.type == "char") {
                            password += subZone.char
                            updatePassword()
                            addZone(defaultZoneGroup)
                        }
                        if (subZone.type == "changeZone") {
                            addZone(groups[subZone.target])
                        }
                        if (subZone.type == "backspace") {
                            if (password.length) {
                                password = password.slice(0, -1)
                                updatePassword()
                            }
                            addZone(defaultZoneGroup)
                        }
                    }
                })
                zone.done = true
            }
            return zone
        })
    }
    setTimeout(update, 1000 / 144)
}
let spacePressed = false
addEventListener("keydown", (ev) => {
    if (flappyMode == "login" && !flappying) return
    if (ev.code == "Space") {
        if (spacePressed) return
        spacePressed = true
        if (!bird.dead) {
            if (!gameStarted) {
                gameStarted = true
            }
            bird.yVelocity = 0.4
        } else {
            bird.dead = false
            bird.y = 500
            bird.yVelocity = 0
            if (flappyMode == "login") {
                password = ""
                updatePassword()
                keyZones = []
                addZone(defaultZoneGroup)
            }
            gameStarted = false
            update()
        }
    }
})
addEventListener("keyup", (ev) => {
    if (ev.code == "Space") spacePressed = false
})
