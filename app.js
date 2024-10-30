const express = require('express')
const bodyParser = require("body-parser")
const dotenv = require('dotenv').config();
const cors = require("cors")
const multer = require('multer')
const mongoose = require("mongoose");
const blogRoute = require('./route/blogRouter');
const categoryRoute = require('./route/categoryRouter');
const path = require("path");
const userRoute = require('./route/userRoute');
const { v2 : cloudinary } = require('cloudinary');

const app = express();

const storage = multer.diskStorage({
    filename : (req,file,cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     cb(null,uniqueSuffix + '_' + file.originalname);
    }
})

// Configuration
cloudinary.config({
    cloud_name: 'dsvuqjirb',
    api_key: '766943232259641',
    api_secret: 'RxW3ffxkWEHxKC4EyJ9chUD1q7w'
});


app.use(cors())
app.use(bodyParser.urlencoded({extended :false}))
app.use('/api/uploads',express.static(path.join(__dirname,'uploads')))
app.use(bodyParser.json())
app.use(multer({storage }).fields([
    {
        name : "pfp",
        maxCount : 1
    },
    {
        name : "icon",
        maxCount : 1
    },
    {
        name : "backdrop",
        maxCount : 1
    },
]))
 //
 app.use("/api",blogRoute)
 app.use("/api",categoryRoute)
 app.use("/api",userRoute)

mongoose.connect(process.env.MONGO_DB)
.then(()=>{
    app.listen(8000,()=>{
    console.log("Running on port 8000.")
    })
})
.catch((err)=>{
    console.log(err)
})