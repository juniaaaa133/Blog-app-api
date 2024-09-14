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
    .populate("categories","name")
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
    res.status(404).send(err)
    return res.end();
})
}

exports.createBlog = (req,res) => {
let {
    title,
    // overview,
    // releasedDate,
    // gameUrl,
    // rating,
    // size,
    categories //[232323,4343434, 34343434,...] means [_id,_id,_id,..]
} = req.body;

// let {icon,backdrop} = req.file.filename;

Blog.create({
    title,
    categories
    // overview,
    // releasedDate,
    // gameUrl,
    // rating,
    // size,
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

}
exports.updateBlog = (req,res) => {

}
exports.deleteBlog = (req,res) => {
    
}