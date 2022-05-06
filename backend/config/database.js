const mongoose = require('mongoose');


const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI).
    then((x) =>{
       console.log(`mongodb connected with server at ${x.connection.port}`);
    })
}

module.exports = connectDatabase;