const express = require("express")
const morgan = require("morgan")
const AppError = require("./utils/AppError")
const userR = require("./routes/user")
const authR = require("./routes/auth")
const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())

app.use("/api/users", userR)
app.use("/api/auth", authR)

app.get("/", (req, res)=>{
    res.send("server running")
})

app.use("*", (req, res, next)=>{
    next (new AppError(`cant find ${req.originalUrl} on this server`), 404)
})


module.exports = app;