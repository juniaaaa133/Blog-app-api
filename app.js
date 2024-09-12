const express = require('express')
const bodyParser = require("body-parser")
const dotenv = require('dotenv').config();
const cors = require("cors")
const multer = require('multer')
const mongoose = require("mongoose")

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({extended :false}))
app.use(bodyParser.json())

mongoose.connect(process.env.MONGO)
.then(()=>{
    app.listen(8000,()=>{
    console.log("Running on port 8000.")
    })
})
.catch((err)=>{
    console.log(err)
})