const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const registerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
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
  confirm_password: {
    type: String,
    required: true,
  },
  age: { type: Number ,
  default:22},
  gender: { type: String, enum: ["male", "female", "other"],
default:'male' },
  email: { type: String ,
  default:'xyz@gmail.com'},
  contactNumber: { type: String ,
  default:'9999999999'},
  address: { type: String ,
  default:'xyz'},
  college: { type: String ,
  default:'abcd'},
  topSkills: [{ type: String}],
  areaOfInterest: { type: String ,
  default:'xyzz'},
  yearsOfExperience: { type: Number,
  default:1},
  linkedinURL: { type: String ,default:'https://www.linkedin.com/feed/'},
  githubURL: { type: String ,default:'https://www.github.com/feed/'},
  instaURL: { type: String,
  default:'https://www.instagram.com/feed/' },
  photo: { type: String ,default:'/upload/'},
});
// Middleware function
registerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    console.log(`the current password is ${this.password}`);
    this.password = await bcrypt.hash(this.password, 10);
    console.log(`the current password is ${this.password}`);
    this.confirm_password = undefined;
  }
  next();
});

const Register1 = new mongoose.model("Register1", registerSchema);

module.exports = Register1;
