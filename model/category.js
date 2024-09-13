const {Schema,model} = require("mongoose")

const categorySchema = new Schema({
    name : {
        type : String,
        required : true
    },
    code : {
        type : Number,
        required : true
    }
})

module.exports = model("Category",categorySchema)