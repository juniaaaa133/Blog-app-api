const {Router} = require("express")

const route = Router();

//Default routes
route.post("/login"); //both user and admin can login
route.post("/register"); //only users can signup
route.post('/forgot') //send email for reset password page;
route.post('/reset-password/:token') //authorize by token for changing password page;

//admin routes
route.get("/users"); //Admin can see all users;
route.create('/create-user'); //Admin can add new user without any permession.
route.put("suspend-user/:id") //Admin can suspend user account for 14 days;

//Complex routes (Both for user and admin)
route.put("/users/:id")//Admin can update any user's account , user can edit own account.
route.delete("/users/:id") //Admin can ban any user , user can delete own account.
