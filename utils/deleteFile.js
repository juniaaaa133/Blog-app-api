const fs = require("fs")

exports.deleteFile = (path) => {
if(path){
fs.unlink(path)
}
}

