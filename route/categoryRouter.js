const {Router} = require("express");
const { getAllCategories, createCategory, showCategory, updateCategory, deleteCategory } = require("../controller/categoryController");

const route = Router();

route.get('/categories',getAllCategories);
route.get('/categories/:id',showCategory);
route.post('/categories',createCategory);
route.put('/categories',updateCategory);
route.delete('/categories',deleteCategory);

module.exports = route;