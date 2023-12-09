const express = require('express');
const app = express()
const colors = require('colors');
const passport = require('passport');
const session = require('express-session');

const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 4000;

//Database
const connectDB = require('./config/DB');
connectDB();

//To accept the data from frontend in the form of json
app.use(express.json());

//routes
const userRoutes = require('./routes/userRoutes');
const {notFound,errorHandler} = require('./middleware/errorMiddleWare');

//ROUTES START
//error handling
app.use(notFound);
app.use(errorHandler);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/user',userRoutes);


//ROUTES END


app.listen(PORT,()=>{
    console.log(`Server is started on port : ${PORT}`.yellow.bold);
})

//DATABASE DETAILS
/* 
username:phanendralg12
password: nGMu7Osnlxbnk9U1
*/