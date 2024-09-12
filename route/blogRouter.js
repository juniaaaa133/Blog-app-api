const express = require('express');
const { getAllBlogs, createBlog, showBlog, updateBlog, deleteBlog } = require('../controller/blogController');
const { checkSchema } = require('express-validator');
const { validateBlogSchema } = require('../validateSchema/validateBlogSchema');

const route = express.Router();

route.get("/blogs",getAllBlogs)
route.post(
    "/blogs",
    checkSchema(validateBlogSchema),
    createBlog
)
route.get("/blogs/:id",showBlog)
route.put(
    "/blogs/:id",
    checkSchema(validateBlogSchema),
    updateBlog
)
route.delete("/blogs/:id",deleteBlog)

