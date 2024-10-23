const jwt = require("jsonwebtoken")
require("dotenv").config();

let authenticate = (req,res,next) => {
const tokenStr = req.headers["authorization"]
if(!tokenStr){
res.status(403).json({
"success" : false,
"message" : "Missing authorization header."
})
return res.end();
}
const token = tokenStr.split(" ")[1]
const JWT = jwt.verify(token,process.env.JWT_KEY);
if(!JWT){
res.status(401).json({
"success" : false,
"message" : "Unauthenticated."
})
return res.end();
}
req.userId = JWT.id
req.token = tokenStr;
next();
}

module.exports = authenticate;