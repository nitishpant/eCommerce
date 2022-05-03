const mongoose = require('mongoose');


const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI).
    then((x) =>{
       console.log(`mongodb connected with server ${x.connection.host}`);
    }).catch((x)=>{
        console.log(`mongodb error : ${x}`);
    });
}

module.exports = connectDatabase;