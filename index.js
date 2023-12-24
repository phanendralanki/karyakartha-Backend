const express = require('express');
const app = express()
const colors = require('colors');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 4000;
//Database
const connectDB = require('./config/DB');
connectDB();
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const morgan = require("morgan");
app.use(morgan("dev"));

//To accept the data from frontend in the form of json
app.use(express.json());

//routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require("./routes/jobRoutes");
const {notFound,errorHandler} = require('./middleware/errorMiddleWare');


//bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());
//ROUTES START
app.use("/api/user", userRoutes);
app.use("/api/jobs",jobRoutes);

//error handling
app.use(notFound);
app.use(errorHandler);
app.use(passport.initialize());
app.use(passport.session());


//Google Auth
// passport.use(
//   new OAuth2Stratergy(
//     {
//       clientID: process.env.clientId,
//       clientSecret: process.env.clientSecret,
//       callbackURL: "/auth/google/callback",
//       scope: ["profile", "email"],
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log(profile);
//       try {
//         let user = await userModel.findOne({ googleId: profile.id });
//         if (!user) {
//           user = new userModel({
//             googleId: profile.id,
//             fullName: profile.fullName,
//             email: profile.emails[0].value,
//             image: profile.photos[0].value,
//           });

//           await user.save();
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// //initial google auth login
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:3000/dashboard",
//     failureRedirect: "http://localhost:3000/login",
//   })
// );

//ROUTES END


app.listen(PORT,()=>{
    console.log(`Server is started on port : ${PORT}`.yellow.bold);
})

//DATABASE DETAILS
/* 
username:phanendralg12
password: nGMu7Osnlxbnk9U1
*/