exports.validateUserSignUpSchema = {
username : {
notEmpty  : {
errorMessage : "Please enter email address."
},
},
email : {
notEmpty  : {
errorMessage : "Please enter email address."
},
isEmail : {
errorMessage : "Please enter valid email address."
}
},
password : {
notEmpty  : {
errorMessage : "Please enter email address."
},
isLength : {
min : 7,
errorMessage : "Password character must be at least 7."
},
trim : true
}
}

exports.validateUserLoginSchema = {
email : {
notEmpty  : {
errorMessage : "Please enter email address."
},
isEmail : {
errorMessage : "Please enter valid email address."
}
},
password : {
notEmpty  : {
errorMessage : "Please enter email address."
},
isLength : {
min : 7,
errorMessage : "Password character must be at least 7."
},
trim : true
}
}