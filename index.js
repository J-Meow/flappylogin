import dotenv from "dotenv"
dotenv.config()
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

app.post("/api/signup", (req, res) => {
    console.log(req.body)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
