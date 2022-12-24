const express = require("express")
const globalErrorHandler = require('./controllers/errorController');
const morgan = require("morgan")
const AppError = require("./utils/appError")
const userRoute = require("./routes/studentRoutes")
const authRoute = require("./routes/authRoutes")
const tutorRoute = require("./routes/tutorRoutes")
const postRoute = require("./routes/postRoutes")
const messageRoute = require("./routes/messageRoute")
const chatRoute = require("./routes/chatRoute")
const cors = require("cors");
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const xss = require('xss-clean');

const app = express()


// Set security HTTP headers
app.use(helmet())

// Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//limit request from same Api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!"
})

app.use("/api", limiter)

// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}))

// Data sanitization against XSS
app.use(xss());

app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/tutor", tutorRoute)
app.use("/api/post", postRoute )
app.use("/api/message", messageRoute)
app.use("/api/chat", chatRoute)

app.use(globalErrorHandler)

app.use(cors())

app.get("/", (req, res)=>{
    res.send("Franca server running")
})

app.use("*", (req, res, next)=>{
    next (new AppError(`Cant find ${req.originalUrl} on this server`), 404)
})


module.exports = app;
