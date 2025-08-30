import dotenv from "dotenv"
dotenv.config()
import bcrypt from "bcrypt"
import express from "express"
import postgres from "postgres"
import session from "express-session"
import memoryStore from "memorystore"
const MemoryStore = memoryStore(session)
const app = express()
const port = 3000
const sql = postgres()

app.use("/", express.static("public"))
app.use(express.json())
app.use(
    session({
        secret: process.env.SESSIONSECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true, httpOnly: true },
        store: new MemoryStore({
            checkPeriod: 86400000,
        }),
    }),
)

//app.get("/", (req, res) => {
//    res.send("Hello World!")
//})

app.post("/api/signup", async (req, res) => {
    const userCheck =
        await sql`SELECT id FROM public.users WHERE name=${req.body.username}`
    if (userCheck.length) {
        return res.status(400).json({ ok: false, error: "Username is taken" })
    }
    console.log(
        await sql`INSERT INTO "public"."users"("name", "password_hash") VALUES(${req.body.username}, ${await bcrypt.hash(req.body.password, 10)}) RETURNING "id"`,
    )
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
    return res.json({ ok: true })
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
