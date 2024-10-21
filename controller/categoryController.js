const Blog = require("../model/blog");
const Category = require("../model/category")

exports.getAllCategories = (req,res) => {
    Category.find()
    .then((categories) => {
    res.status(200).json(categories)
    res.end();
    })
}

exports.createCategory = (req,res) => {
    const {name,code} = req.body;

    Category.create({
        name,
        code
    })
    .then(()=>{
        res.status(201).send("Created successfully.")
        res.end();
    })
    .catch((err) =>{
        res.status(500).send(err)
    })
}

exports.showCategory = (req,res) => {
    let {id} = req.params;
    Category.findOne({name : id})
    .populate("blogs")
    .then((category) => {
     Blog.find({category : category._id})
    .then((blogs) => {
    res.status(200).json({
        category,
        blogs
    })})
    }).catch((err) => {
        res.status(500).send(err)
        res.end();
    })
}

exports.updateCategory = (req,res) => {
    const {name,code} = req.body;
    const {id} = req.params

    Category.findById(id)
    .then((category) => {
        category.name = name;
        category.code = code;
        category.save();
    })
    .then(()=>{
        res.status(200).send("Updated successfully.")
        res.end();
    })
    .catch((err)=>{
        res.status(500).send(err)
        res.end();
    })
}

exports.deleteCategory = (req,res) => {
    const {id} = req.params
    Category.findByIdAndDelete(id)
    .then(()=> {
        res.status(204);
        res.end();
    })
    .catch((err)=>{
        res.status(500).send("Something went wrong.");
        res.end();
    })
}