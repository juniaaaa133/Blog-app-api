const {Router} = require("express");
const { checkSchema } = require("express-validator");
const { validateUserLoginSchema } = require("../validateSchema/vlaidateUserSchema");
const { login, register, confirmRegister, getUser, updateUser, deleteUser, getAllUsers } = require("../controller/userController");
const authenticate = require("../middleware/authenticate");

const route = Router();

//Default routes
route.post("/login",checkSchema(validateUserLoginSchema),login); //both user and admin can login
route.post("/register",checkSchema(validateUserLoginSchema),register); //only users can signup
route.get("/confirm-register/:token",confirmRegister)
// route.post('/forgot') //send email for reset password page;
// route.post('/reset-password/:token') //authorize by token for changing password page;

//admin routes
route.get("/users",authenticate,getAllUsers); //Admin can see all users;
// route.put("suspend-user/:id") //Admin can suspend user account for 14 days;

//Complex routes (Both for user and admin)
route.get("/users/:email",authenticate,getUser)
route.put("/users/:email",authenticate,updateUser)//Admin can update any user's account , user can edit own account.
route.delete("/users/:email",authenticate,deleteUser) //Admin can ban any user , user can delete own account.

module.exports = route;