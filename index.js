import dotenv from "dotenv"
dotenv.config()
import bcrypt from "bcrypt"
import express from "express"
import postgres from "postgres"
import session from "express-session"
import memoryStore from "memorystore"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const MemoryStore = memoryStore(session)
const app = express()
const port = 3000
const sql = postgres()

app.use(
    session({
        secret: process.env.SESSIONSECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, httpOnly: true },
        store: new MemoryStore({
            checkPeriod: 86400000,
        }),
    }),
)

function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login")
    }
    next()
}
app.use(express.json())
app.get("/", (req, res) => {
    if (!req.session.userId) {
        return res.sendFile(path.join(__dirname, "public/index.html"))
    }
    return res.sendFile(path.join(__dirname, "private/index.html"))
})
app.use("/play", requireLogin)
app.use("/", express.static("public"))

app.post("/api/signup", async (req, res) => {
    const userCheck =
        await sql`SELECT id FROM public.users WHERE name=${req.body.username}`
    if (userCheck.length) {
        return res.status(400).json({ ok: false, error: "Username is taken" })
    }
    let resp =
        await sql`INSERT INTO "public"."users"("name", "password_hash") VALUES(${req.body.username}, ${await bcrypt.hash(req.body.password, 10)}) RETURNING "id"`
    if (resp.length && resp[0].id) {
        req.session.userId = user.id
    }
    return res.json({ ok: true })
})

app.post("/api/login", async (req, res) => {
    const resp =
        await sql`SELECT id, password_hash FROM public.users WHERE name=${req.body.username}`
    if (resp.length != 1) {
        return res
            .status(400)
            .json({ ok: false, error: "Incorrect username or password" })
    }
    const user = resp[0]
    if (!(await bcrypt.compare(req.body.password, user.password_hash))) {
        return res
            .status(400)
            .json({ ok: false, error: "Incorrect username or password" })
    }
    req.session.userId = user.id
    return res.json({ ok: true })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
