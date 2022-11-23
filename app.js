const express = require("express")
const globalErrorHandler = require('./controllers/errorController');
const morgan = require("morgan")
const AppError = require("./utils/AppError")
const userRoute = require("./routes/studentRoutes")
const authRoute = require("./routes/authRoutes")
const tutorRoute = require("./routes/tutorRoutes")
const cors = require("cors");


const app = express()

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/tutor", tutorRoute)

app.use(globalErrorHandler)
app.use(cors())

app.get("/", (req, res)=>{
    res.send("Franca server running")
})



app.use("*", (req, res, next)=>{
    next (new AppError(`cant find ${req.originalUrl} on this server`), 404)
})


module.exports = app;