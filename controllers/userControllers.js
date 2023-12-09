const asyncHandler = require('express-async-handler');

const UserModel = require('../models/UserModel');

const generateToken = require('../config/generateToken');



const registerUser = asyncHandler(async(req,res)  =>{
    const {fullName,email,password,mobileNumber,pic} = req.body;

    //validation
    if(!fullName|| !email || !password || !mobileNumber){
        res.status(400);
        throw new Error("Please Enter all the fields");
    }

    const userExists = await UserModel.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User Already exists");
    }

    const newUser = await UserModel.create({
        fullName,
        email,
        password,
        mobileNumber,
        pic,
    });

    if(newUser){
        res.status(201).json({
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          password: newUser.password,
          mobileNumber: newUser.mobileNumber,
          pic: newUser.pic,
          token: generateToken(newUser.id),
        });
    } else{
        res.status(400);
        throw new Error("Failed to create the user");
    }
});

//Google signup
const googleSignUp = async (req,res)=>{
    //checking if the user already exists in our database
    const existingUser = await UserModel.findOne({email});
    if(existingUser){
        //if the user already exists
         res.status(400);
         throw new Error("User Already exists");
    }else{
        //if the user does not exists, create a new user
        const newUser = await UserModel.create({
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          password: 'randomPassword',
          mobileNumber: newUser.mobileNumber,
          pic: newUser.pic,
          token: generateToken(newUser.id),
        });
    }
}


/*
    Login controller
*/
const authUser = asyncHandler(async (req,res)=>{
    const {email,password} = req.body; 
    const userExists = await UserModel.findOne({email});
    if(userExists && (await userExists.matchPassword(password))){
        res.json({
            id:userExists.id,
            fullName:userExists.fullName,
            email:userExists.email,
            password:userExists.password,
            mobileNumber:userExists.mobileNumber,
        })
    }else if(userExists && !(await userExists.matchPassword(password))){
        res.json("incorrect email or password")
    }else{
        res.json("user does not exists!");
    }
})

module.exports = {registerUser,authUser,googleSignUp};