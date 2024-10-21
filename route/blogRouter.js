const express = require('express');
const { getAllBlogs, createBlog, showBlog, updateBlog, deleteBlog, clearAllBlogs, findBlogs, searchBlogs } = require('../controller/blogController');
const { checkSchema } = require('express-validator');
const { validateBlogSchema } = require('../validateSchema/validateBlogSchema');
const authenticate = require('../middleware/authenticate');

const route = express.Router();

route.get("/blogs",getAllBlogs)
route.get("/blogs/:id",showBlog)
route.get("/filter-blog",findBlogs)
route.get("/blog/search",searchBlogs)
route.post(
    "/blogs",
    authenticate,
    checkSchema(validateBlogSchema),
    createBlog
)
route.put(
    "/blogs/:id",
    authenticate,
    checkSchema(validateBlogSchema),
    updateBlog
)
route.delete("/blogs/:id",authenticate,deleteBlog)

module.exports = route;
