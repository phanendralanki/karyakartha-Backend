//for verification of the jwt token
//user or admin checking

const userModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await userModel.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please login again");
    }
  } else {
    throw new Error("There is no token attached to the header");
  }
});

//for admin
const isAdmin = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  const { email } = req.user;
  const adminUser = await userModel.findOne({ email });
  //if not admin
  if (adminUser.role !== "admin") {
    throw new Error("You are not a admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware, isAdmin };
