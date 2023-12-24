const asyncHandler = require("express-async-handler");
const UserModel = require("../models/UserModel");
const generateToken = require("../config/generateToken");
const {generateRefreshToken} = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const validateMongoDbId = require('../utils/validateMongoDbId');

const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;

/* 
    ==============================
        user Registration - Start
    ==============================
*/
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, mobileNumber, pic } = req.body;

  //validation
  if (!fullName || !email || !password || !mobileNumber) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already exists");
  }

  const newUser = await UserModel.create(req.body);
  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

/* 
    ==============================
        user Registration - END
    ==============================
*/

/*
===================================
    Login controller - START
==================================
*/
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //console.log(email,password);
  //checking if the user exists or not
  const findUser = await UserModel.findOne({ email });
  if (findUser && (await findUser.matchPassword(password))) {
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateUser = await UserModel.findByIdAndUpdate(
      findUser?.id,
      {
        refreshToken: refreshToken,
      },
      {
        new: true,
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      fullName: findUser?.fullName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?.id),
    });
  } else if (findUser && !(await findUser.matchPassword(password))) {
    res.json("incorrect email or password");
  } else {
    res.json("user does not exists!");
  }
});

/*
===================================
    Login controller - END
==================================
*/

/*
====================================
    Handle Refresh Token - STARTS
====================================
*/
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  //console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  //console.log(refreshToken);
  const user = await UserModel.findOne({ refreshToken:refreshToken });
  if (!user) {
    throw new Error("No Refresh Token present in cookies");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    //console.log(decoded);
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh Token");
    }
    const accessToken = generateToken(user?.id);
    res.json({ accessToken });
  });
  //res.json(user);
});

/*
====================================
    Handle Refresh Token - END
====================================
*/

/*
====================================
    Logout Functionality - Starts
====================================
*/

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await UserModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); //forbidden
  }

  await UserModel.findOneAndUpdate(
    { refreshToken:refreshToken },
    {
      refreshToken: "",
    }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); //forbidden
});

/*
====================================
    Logout Functionality - END
====================================
*/

//Get all users

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await UserModel.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error("No users");
  }
});

//get a single user details
const getAUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  // validateMongoDbId(id);
  try {
    const getAUser = await UserModel.findById(id);
    res.json(getAUser);
  } catch (error) {
    throw  error;
  }
});

//update a user
const updateUser = asyncHandler(async (req, res) => {
    // console.log();
  const { _id } = req.user;
  validateMongoDbId(id);
  try {
    const updateUser = await UserModel.findByIdAndUpdate(
      _id,
      {
        fullName: req?.body?.firstName,
        email: req?.body?.email,
        password: req?.body?.password,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error("No user found");
  }
});

// delete a user
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteAUser = await UserModel.findByIdAndDelete(id);
    res.json(deleteAUser);
  } catch (error) {
    throw new Error("No user to delete");
  }
});

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.clientId,
      clientSecret: process.env.clientSecret,
      callbackURL: "api/user/googleAuth/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      try {
        let user = await UserModel.findOne({ googleId: profile.id });
        if (!user) {
          user = new UserModel({
            googleId: profile.id,
            fullName: profile.displayName, // Adjust the field based on Google profile structure
            email: profile.emails[0].value,
            pic: profile.photos[0].value,
          });

          await user.save();
        }

        // Generate token and send it back to the client
        const token = generateToken(user.id);

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Callback route after Google authentication
const googleAuth = asyncHandler(async (req, res) => {
  "api/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "http://localhost:3000/login",
    }),
    (req, res) => {
      // Successful authentication
      res.redirect(`http://localhost:3000/dashboard?token=${req.user.token}`);
    };
});

module.exports = {
  registerUser,
  loginUser,
  googleAuth,
  handleRefreshToken,
  logout,
  getAllUsers,
  getAUserById,
  updateUser,
  deleteUser
};
