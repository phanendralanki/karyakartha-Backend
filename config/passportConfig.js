const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/UserModel');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/signup/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // checking if the user already exists in the database or not
        const existingUser = await UserModel.findOne({
          email: profile.emails[0].value,
        });
        if (existingUser) {
          //If the user already exists, log them in
          return done(null, existingUser);
        }

        //If the user does not exists, create a new user
        const newUser = await UserModel.create({
          fullName: profile.displayName,
          email: profile.emails[0].value,
          // need to generate a random password for Google Sign-In
          password: "randomePassword",
          mobileNumber: profile.mobiles[0].value,
        });
        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async (id,done)=>{
    try{
        const user = await UserModel.findById(id);
        done(null,user);
    }catch(error){
        done(error,null);
    }
});

module.exports = passport;