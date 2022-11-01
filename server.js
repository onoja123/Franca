const app = require("./app")
const http = require("https")
const mongoose = require("mongoose")
const server = http.createServer(app)
const dotenv = require("dotenv")
const { config } = require("process")


//catching errors
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({path: "./config.env"})

//replacing databasename with password

const DB = process.env.DATABASE.replace(
    'password', 
    process.env.DATABASE_PASSWORD
)

//coonecting database

mongoose.connect(DB, {
    useNewUrlParser: true
}).then(()=>{
    console.log("database connected sucessfully")
})

//defining port

const PORT = process.env.PORT || 3000

//server listening to port
server.listen(PORT, ()=>{
    console.log(`server running on PORT ${PORT}`)
})


process.on("unhandledRejection", err =>{
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
})