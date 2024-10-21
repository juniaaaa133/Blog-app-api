const {Schema,model} = require("mongoose")

const userSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    role : {
       type : String,
       default : "user"
    },
    pfp : {
        type : String,
        default : null
    },
    password : {
        type : String,
        required : true
    },
    joinedDate  : {
        type : Date,
        required : true,
    },
    authToken : {
        type : String
    },
    tokenExp : {
        type : Date,
    },
})

module.exports = model("User",userSchema)