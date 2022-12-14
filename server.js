const app = require("./app")
const mongoose = require("mongoose")
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
    console.log("Database connected sucessfully")
}).catch(err =>{
  console.log(err.name, err.message)
})

mongoose.set('strictQuery', false);

//defining port

/** @type {*} */
const PORT = process.env.PORT || 3000

//server listening to port
/** @type {*} */
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});

process.on("unhandledRejection", err =>{
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
})