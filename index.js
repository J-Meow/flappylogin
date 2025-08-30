import dotenv from "dotenv"
dotenv.config()
import bcrypt from "bcrypt"
import express from "express"
import postgres from "postgres"
const app = express()
const port = 3000
const sql = postgres()

app.use("/", express.static("public"))
app.use(express.json())

//app.get("/", (req, res) => {
//    res.send("Hello World!")
//})

app.post("/api/signup", async (req, res) => {
    console.log(
        await sql`INSERT INTO "public"."users"("name", "password_hash") VALUES(${req.body.username}, ${await bcrypt.hash(req.body.password, 10)}) RETURNING "id"`,
    )
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
