const Blog = require("../model/blog")

exports.getAllBlogs = (req,res) => {
    // blogs?page=1,2,..
let page = req.query.page || 1;
let pagination = 20;
let totalBlogCount;
let pages;

Blog.countDocuments()
.then((count) => {
    totalNoteCount = count;
    pages =Math.ceil(count / pagination)
    return Blog.find()
    // .populate("category")
    .limit(pagination)
    // .sort({createdAt : -1})
    .skip((page -1) * pagination)
})
.then((blogs)=>{
    res.status(200).json({
        blogs,
        blog_info : {
         blog_pages : pages,
        total_blog_counts : totalBlogCount
        }
    })
    return res.end();
})
.catch((err)=>{
    console.log(res,req)
    res.status(404).send("Please check your request again.")
    return res.end();
})
}

exports.createBlog = (req,res) => {

}
exports.showBlog = (req,res) => {

}
exports.updateBlog = (req,res) => {

}
exports.deleteBlog = (req,res) => {
    
}