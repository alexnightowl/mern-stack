const express = require("express")
const config = require("config")
const mongoose = require("mongoose")

const app = express()
const PORT = config.get("port") || 5000

app.use("/api/auth", require("./routes/auth.routes"))

async function start() {
    try {
        await mongoose.connect(config.get("mongoLocal"), {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}...`)
        })
    } catch (error) {
        console.log("Server Error", error.message)
        process.exit(1)
    }
}

start()