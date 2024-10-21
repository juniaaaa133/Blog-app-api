const { validationResult } = require("express-validator");
const Blog = require("../model/blog")
const Category = require("../model/category")
const deleteFile = require("../utils/deleteFile")
const path = require("path")

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

exports.createBlog = (req,res) => {
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
icon ?
deleteFile(path.join(__dirname,'..','uploads',icon.filename))
: backdrop &&
deleteFile(path.join(__dirname,'..','uploads',backdrop.filename))
res.status(400).send("Image should be png,jpg or jpeg.")
return res.end()
}

Blog.create({
    title,
    categories : JSON.parse(categories),
    overview,
    releasedDate,
    isOnline : isOnline ? isOnline : null,
    gameUrl,
    rating,
    size,
    icon : icon.path,
    backdrop : backdrop.path,
    intro,
    createdAt : Date.now()
    
})
.then(()=>{
    res.status(201).send("Created successfully.")
    res.end();
})
.catch((err)=>{
    res.status(500).send(err)
    res.end()
})

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

exports.updateBlog = (req,res) => {
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
 const {id} = req.params;

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
icon && icon.mimetype !== "image/jpeg" &&
icon && icon.mimetype !== "image/jpg" &&
icon && icon.mimetype !== "image/png" ||
backdrop && backdrop.mimetype !== "image/png" &&
backdrop && backdrop.mimetype !== "image/jpeg" &&
backdrop && backdrop.mimetype !== "image/jpg" 
){
icon ?
deleteFile(path.join(__dirname,'..','uploads',icon.filename))
: backdrop &&
deleteFile(path.join(__dirname,'..','uploads',backdrop.filename))
res.status(400).send("Image should be png,jpg or jpeg.")
return res.end()
 }

Blog.findById(id)
.then((blog)=>{
if(categories){
blog.categories = JSON.parse(categories);
}
if(backdrop){
blog.backdrop = backdrop.path;
}
if(icon){
blog.icon = icon.path;
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
 })
.then(()=>{
res.status(200).send("Successfully updated.")
res.end();
})
.catch((err)=>{
    res.status(500).send(err)
    res.end()
})}

exports.deleteBlog = (req,res) => {
const {id} = req.params;

Blog.findById(id)
.then((blog)=>{
deleteFile(path.join(__dirname,"..",blog.icon))
deleteFile(path.join(__dirname,"..",blog.backdrop))
Blog.findByIdAndDelete(id)
.then(()=>{
res.status(204);
res.end();
})
})
.catch((err)=>{
    res.status(500).send(err)
    res.end()
})
}
