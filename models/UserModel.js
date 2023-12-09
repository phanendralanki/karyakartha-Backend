//Full name
//Email
//Password
//Mobile number

const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userModel = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },

},
    {timeStamps:true}
);

//method to check the password of the user during login
userModel.methods.matchPassword = async function (enteredPassword){
  return await bcryptjs.compare(enteredPassword,this.password);
}

// bcryptjs - encrypting password before storing into the database
userModel.pre('save',async function (next){
  if(!this.isModified){
    next()
  }

  const salt = await bcryptjs.genSalt(10);// the higher the number the more higher security salt will be generated
  this.password = await bcryptjs.hash(this.password,salt);
});

const userSchema = mongoose.model('user',userModel);
module.exports = userSchema;