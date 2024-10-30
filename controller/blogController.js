const { validationResult } = require("express-validator");
const Blog = require("../model/blog")
const Category = require("../model/category")
const deleteFile = require("../utils/deleteFile")
const path = require("path")
const { v2 : cloudinary } = require('cloudinary');

exports.getAllBlogs = (req,res) => {
    // blogs?page=1,2,..
let page = req.query.page || 1;
let pagination = 20;
let totalBlogCount;
let pages;

Blog.countDocuments()
.then((count) => {
    totalBlogCount = count;
    pages =Math.ceil(count / pagination)
    return Blog.find()
    .populate("categories","name")
    .limit(pagination)
    .sort({createdAt : -1})
    .skip((page -1) * pagination)
})
.then((blogs)=>{
    res.status(200).json({
        blogs,
        blogInfo : {
        // addressUrl :req.protocol + '://' + req.get('host') + req.originalUrl,
        totalBlogs : totalBlogCount,
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

exports.findBlogs = (req,res) => {
const category = req.query.category;
const online = req.query.online;
let page = req.query.page || 1;
let pagination = 20;
let totalBlogCount;
let pages;
let categoryGenre;

Category.findOne({name : category})
.then((categoryData) => {
categoryGenre = categoryData;

if(online && online !== "null"){
return Blog.countDocuments({
categories : categoryData._id,
isOnline : online || "null" //online gaems => online + hybird , offline games => offline + hybird;
})
}else{
return Blog.countDocuments({
categories : categoryData._id, // any games;
})
}
})
.then((blogCount) => {
pages = Math.ceil(blogCount / pagination)
totalBlogCount = blogCount;

if(online && online !== "null"){
return Blog.find({
categories : categoryGenre._id,
isOnline : online ? online : 'null'
})
.populate("categories","name")
.sort({createdAt : -1})
.limit(pagination)
.skip((page - 1) * pagination)
}else{
return Blog.find({
categories : categoryGenre._id,
})
.populate("categories","name")
.sort({createdAt : -1})
.limit(pagination)
.skip((page - 1) * pagination)
}
})
.then((blogs) => {
res.status(200).json({
success : true,
blogs,
blogInfo : {
totalBlogs : totalBlogCount,
pages,
}
})
})
.catch((err) => {
res.status(500).json({
success : false,
error : err
})})
}

exports.searchBlogs = (req,res) => {
let keywords = req.query.title;

Blog.find()
.sort({createdAt : -1})
.then((blogs) => {
return blogs.filter((blog) => blog.title.toLowerCase().includes(keywords.toLowerCase()))
})
.then((filteredBlog) => {
res.status(200).json({
success : true,
blogs : filteredBlog,
blogInfo : {
totalBlogs : filteredBlog.length
}
})
})
.catch((err) => {
res.status(500).json({
success :false,
message : "Something went wrong",
err
})
})
}

exports.createBlog = async (req,res) => {
let iconToStore;
let backdropToStore;
let {
    intro,
    title,
    overview,
    isOnline,
    releasedDate,
    gameUrl,
    rating,
    size,
    categories //[232323,4343434, 34343434,...] means [_id,_id,_id,..]
} = req.body;

let icon =req.files.icon && req.files.icon[0];
let backdrop =req.files.backdrop && req.files.backdrop[0];

const errorMsg = validationResult(req)

if(!errorMsg.isEmpty()){
res.status(400).json({
message : errorMsg.array()
})
return res.end()
}
if(
icon.mimetype !== "image/jpeg" &&
icon.mimetype !== "image/jpg" &&
icon.mimetype !== "image/png" ||
backdrop.mimetype !== "image/png" &&
backdrop.mimetype !== "image/jpeg" &&
backdrop.mimetype !== "image/jpg" 
){
res.status(400).send("Image should be png,jpg or jpeg.")
return res.end()
}

try {
await cloudinary.uploader.upload(icon.path,(err,result) => {
iconToStore = result.secure_url;
})
await cloudinary.uploader.upload(backdrop.path,(err,result) => {
backdrop = result.secure_url;
})

await Blog.create({
title,
categories : JSON.parse(categories),
overview,
releasedDate,
isOnline : isOnline ? isOnline : null,
gameUrl,
rating,
size,
icon : iconToStore,
backdrop : backdropToStore,
intro,
createdAt : Date.now()
})
res.status(201).send("Created successfully.")
return res.end();
} catch (error) {
res.status(500).send("Something went wrong.")
res.end()
}

}

exports.showBlog = (req,res) => {
const {id} = req.params;
Blog.findById(id)
.populate("categories","name")
.then((blog) => {
    res.status(200).json({blog});
    res.end();
})
.catch((err)=>{
    res.status(500).send(err)
    res.end()
})
}

exports.updateBlog = async (req,res) => {
let {
 title,
overview,
isOnline,
releasedDate,
gameUrl,
rating,
size,
intro,
categories //[232323,4343434, 34343434,...] means [_id,_id,_id,..]
 } = req.body;
 let {id} = req.params;

 let icon = req.files.icon && req.files.icon[0];
 let backdrop =req.files.backdrop && req.files.backdrop[0];
 const errorMsg = validationResult(req)
 
 if(!errorMsg.isEmpty()){
 res.status(400).json({
 message : errorMsg.array()
 })
 return res.end()
 }

if(
icon && icon.mimetype !== "image/jpeg" &&
icon && icon.mimetype !== "image/jpg" &&
icon && icon.mimetype !== "image/png" ||
backdrop && backdrop.mimetype !== "image/png" &&
backdrop && backdrop.mimetype !== "image/jpeg" &&
backdrop && backdrop.mimetype !== "image/jpg" 
){
res.status(400).send("Image should be png,jpg or jpeg.")
return res.end()
 }
try {
let blog = await Blog.findById(id)
if(categories){
blog.categories = JSON.parse(categories);
}
if(icon){
await cloudinary.uploader.upload(icon.path,(err,result) => {
if(!err){
blog.icon = result.secure_url;
console.log(blog.icon , "ICONNn")
}
})
}
if(backdrop){
await cloudinary.uploader.upload(backdrop.path,(err,result) => {
if(!err){
blog.backdrop = result.secure_url;
console.log(blog.backdrop,'backkk');
}
})
}

blog.title = title;
blog.isOnline = isOnline;
blog.overview = overview;
blog.releasedDate = releasedDate;
blog.gameUrl = gameUrl;
blog.rating = rating;
blog.size = size;
blog.intro = intro;
blog.save(); 
res.status(200).send("Successfully updated.")
return res.end();
} catch (er) {
res.status(500).send(err)
res.end()
}
}

exports.deleteBlog = async (req,res) => {
const {id} = req.params;
try {
let blog = await Blog.findById(id);
await cloudinary.uploader.destroy(blog.icon)
await cloudinary.uploader.destroy(blog.backdrop)
await Blog.findByIdAndDelete(id)
res.status(204);
return res.end();
} catch (error) {
res.status(500).send(err)
res.end()
}
}
