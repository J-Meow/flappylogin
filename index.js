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
    console.log(req.body)
    console.log(
        await sql`INSERT INTO "public"."users"("name", "password_hash") VALUES(${req.body.username}, ${await bcrypt.hash(req.body.password, 10)}) RETURNING "id"`,
    )
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
