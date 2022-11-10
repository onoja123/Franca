const express = require("express")
const globalErrorHandler = require('./controllers/errorController');
const morgan = require("morgan")
const AppError = require("./utils/AppError")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)

app.use(globalErrorHandler)


app.get("/", (req, res)=>{
    res.send("Franca server running")
})

// app.use((req, res, next)=>{
//     req.requestTime = new date().toISOString()
//     console.log(req.headers)
//     next()
// })

app.use("*", (req, res, next)=>{
    next (new AppError(`cant find ${req.originalUrl} on this server`), 404)
})


module.exports = app;