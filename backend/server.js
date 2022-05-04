const app = require('./app');

const dotenv = require('dotenv');
const connectDatabase = require("./config/database");

// Handling uncaught Exceptions
process.on("uncaughtException", (err)=>{
    console.log(`Error : ${err.message}`);
    console.log('Shutting down server due to uncaught Exception');
    server.close(()=>{
        process.exit(1);
    });
})

dotenv.config({path:"backend/config/config.env"});

connectDatabase();

const server = app.listen(process.env.PORT, ()=>{
    console.log(`server started at : ${process.env.PORT}`)
})
//unhandled promise rejection
process.on("unhandledRejection", (err)=>{
    console.log(`Error : ${err.message}`);
    console.log('Shutting down server due to unhandled Promise Rejection');
    server.close(()=>{
        process.exit(1);
    });
})