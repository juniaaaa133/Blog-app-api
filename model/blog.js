const {Schema,model} = require("mongoose")

const blogSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    // overview : {
    //     type : String,
    //     required : true
    // },
    // releasedDate : {
    //     type : String,
    //     required : true,
    // },
    // gameUrl : {
    //     type : String,
    //     required : true,
    // },
    // rating : {
    //     type : Number,
    //     required : true
    // },
    // size: {
    //     type : String,
    //     required : true
    // },
    // postDate : {
    //     type : Date,
    //     default : Date.now()
    // },
    // icon : {
    //     type : String,
    // },
    // backdrop : {
    //     type :String,
    // },
    categories : [{
        type : Schema.Types.ObjectId,
        ref : "Category"
    }]

    // category : {
    //     type : Schema.Types.ObjectId,
    //     ref : "Category",
    // }
})

module.exports = model("Blog",blogSchema)