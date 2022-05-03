const mongoose = require('mongoose');


const connectDatabase=()=>{
    mongoose.connect(process.env.DB_URI).
    then((x) =>{
       console.log(`mongodb connected with server ${x.connection.port}`);
    }).catch((x)=>{
        console.log(`mongodb error : ${x}`);
    });
}

module.exports = connectDatabase;