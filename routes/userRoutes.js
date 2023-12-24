const express = require("express");
const router = express.Router();

//importing controllers
const { registerUser, loginUser, getAllUsers, getAUserById, deleteUser, updateUser, handleRefreshToken ,logout} = require("../controllers/userControllers");

//for authentication and admin purpose
const {authMiddleware,isAdmin} = require("../middleware/authMiddleware");

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .get('/all-users',authMiddleware,isAdmin,getAllUsers)
  .get('/:id',authMiddleware,isAdmin,getAUserById)
  .delete("/:id",authMiddleware,isAdmin,deleteUser)
  .put('/:id',authMiddleware,updateUser)
  .get('/handleRefresh',handleRefreshToken)
  .get('/logout',logout)

module.exports = router;
