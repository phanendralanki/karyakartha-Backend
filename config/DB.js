const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_URI,{
            // useNewUrlParser:true,
            // useUnifiedTopology: true,
        });

        console.log(`Database connected: ${con.connection.host}`.green.bold);
    }catch(error){
        console.log(`Error: ${error.message}`.red.bold);
        process.exit();
    }
};

module.exports = connectDB;