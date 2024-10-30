const User = require("../model/user")
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")
const mail = require("nodemailer")
const { v2 : cloudinary } = require('cloudinary');

require("dotenv").config();

//Both user and admin

const transporter = mail.createTransport({
    service : 'gmail',
    auth : {
        user : 'harutokunn133@gmail.com',
        pass : "kmzk rwrr ulfl qkkx"
    }
})


let generateTemplate = (type,username,token) => {
if(type == 'register'){
 return  ` 
<h2>Thanks for registering Mobocat.</h2>
<a target="_blank" href="http://localhost:5173/verify-user/${token}">Please click this link to continue signing up.</a>
<b>Mobocat</b>
<div></div>
<div></div>
<div></div>

<h2>Mobocatအား registerလုပ်ပေးသည့်အတွက်ကျေးဇူးအထူးတင်ပါသည်။.</h2>
<a target="_blank" href="http://localhost:5173/verify-user/${token}">နောက်ဆုံးအဆင့်အနေနဲ့ ဒီlinkလေးထဲကိုဝင်ပေးလိုက်ရင်ရပါပြီ။.</a>
<b>Mobocat</b>

`;
}else{
 return  ` 
<h2>Please reset a new secure password, ${username}.</h2>
<div>Go to this link and reset password </div>
<a target="_blank" href="http://localhost:8000/api/confirm-register/${token}">Reset Password Link</a>
<b>Mobocat</b>
`;
}
}

exports.login = (req,res) => {
const {email,password} = req.body

User.findOne({email})
.then((user) => {
if(!user){
res.status(401).json({
success : false,
message : "Please check your email address."
})
return res.end();
}
bcrypt.compare(password,user.password)
.then((isMatchedPassword) => {
if(!isMatchedPassword){
res.status(401).json({
success : false,
message : "Incorrect email address or password."
})
return res.end();
}
User.findOne({email})
.then((user) => {
const token = jwt.sign({
id : user._id
},process.env.JWT_KEY)
res.status(200).json({
success : true,
user,
token
})
res.end();
})
})
})
.catch((err) => {
res.status(422).json({
success : false,
message : err,
})
res.end();
})

}

exports.register = (req,res) => {
const {email,password,username} = req.body;

User.findOne({email})
.then((user) => {
if(user){
res.status(409).json({
success : false,
message : "Email address is already used."
})
return res.end();
}
bcrypt.hash(password,10)
.then((hashedPassword) => {
return User.create({
username,
email,
password : hashedPassword,
joinedDate : new Date().getTime()
})
})
.then((user) => {
const token = jwt.sign({
id : user._id
},process.env.JWT_KEY)
const expiration = Date.now() + 600000;
user.authToken = token;
user.tokenExp = expiration;
user.save();
return user;
})
.then((user) => {
transporter.sendMail({
to : email,
from : 'harutokunn133@gmail.com',
subject : 'Register Motocat',
html : generateTemplate('register',user.email,user.authToken)
})
res.status(201).json({
success :true,
user,
token : user.authToken,
})
res.end();
})
})
.catch((err) => {
res.status(409).json({
success : false,
message : err.message,
})
res.end();
})
}

exports.confirmRegister = (req,res) => {
const {token} = req.params;

User.findOne({
authToken :token,
tokenExp : {
$gt : Date.now()
}
})
.then((user) => {
if(!user){
User.findOneAndDelete({authToken : token})
.then(() => {
res.status(422).json({
success : false,
message : "Unauthenticated."
})
return res.end();
})
}else{
res.status(200).json({
success : true,
user,
token,
})
res.end();
}
})
.catch((err) => {
res.status(422).json({
success : false,
message : "Unauthenticated"
})
res.end();
})
}

// exports.authorize = (req,res) => {

// }

// exports.resetPassword = (req,res) => {

// }

// exports.setNewPassword = (req,res) => {

// }

//Admin

exports.getAllUsers = (req,res) => {
let page = req.query.page || 1;
let pagination = 20;
let totalUserCount;
let pages;

User.countDocuments()
.then((count) => {
totalUserCount = count;
pages =Math.ceil(count / pagination)
return User.find()
.limit(pagination)
.skip((page -1) * pagination)
})
.then((users)=>{
res.status(200).json({
users,
userInfo : {
totalUsers : totalUserCount,
pages,
}
})
return res.end();
})
.catch((err)=>{
res.status(404).send(err)
return res.end();
})
}

// exports.suspendUser = (req,res) => {

// }

//Both

exports.getUser = (req,res) => {
const {email} = req.params;
let token = req.token;
User.findOne({email})
.then((user) => {
res.status(200).json({
success : true,
user,
token
})
})
.catch((err) => {
res.status(401).json({
success : false,
message : "Failed."
})
})
}

exports.deleteUser = async (req,res) => {
const {email} = req.params;

try {
let user = await User.findOne({email})
if(!user){
res.status(401).json({
success : false,
message : "Unknown user."
})
return res.end();
}
await cloudinary.uploader.destroy(user.pfp)
await User.findOneAndDelete({email})
.then(()=>{
res.status(204)
res.end();
})
} catch (error) {
res.status(401).json({
success : false,
message : "Unknown user."
})
res.end();
}

}

exports.updateUser = async (req,res) => {
const {email} = req.params;
const {
    username,
    role,
} = req.body;
let userPfp = null;

const pfp = req.files && req.files.pfp ? req.files.pfp[0] : null;

const errorMsg = validationResult(req)

if(!errorMsg.isEmpty()){
res.status(400).json({
message : errorMsg.array()
})
return res.end()
}
if(
pfp.mimetype !== "image/jpeg" &&
pfp.mimetype !== "image/jpg" &&
pfp.mimetype !== "image/png" 
){
res.status(400).send("Image should be png,jpg or jpeg.")
return res.end()
}
try {
let user = await User.findOne({email})
if(!user){
res.status(401).json({
success : false,
message : "Unknown user."
})
return res.end()
}
if(pfp){
await cloudinary.uploader.upload(pfp.path,(err,result) => {
userPfp = result.secure_url;
});
}
user.username = username;
user.role = role;
user.pfp = userPfp;
user.save();

res.status(200).json({
success : true,
user,
})
return res.end()
} catch (error) {
res.status(401).json({
success : false,
message: "Unknown user."
})
 res.end()
}
}

