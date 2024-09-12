exports.validateBlogSchema = {
    title : {
        isEmpty  : {
        errorMessage : "Title must not be empty"
        },
        isString : {
            errorMessage : "Title field must be string"
        }
    },
    overview : {
        isEmpty  : {
         errorMessage : "Overview must not be empty"
            },
        isString : {
           errorMessage : "Overview field must be string"
            }
    },
    releasedDate : {
        isEmpty  : {
            errorMessage : "Released Date must not be empty"
         },
         isString : {
            errorMessage : "Released Date field must be string"
            }
    },
    gameUrl : {
        isEmpty  : {
            errorMessage : "Url must not be empty"
         },
        isUrl : {
            errorMessage : "Please put valid url link."
        }
    },
    rating : {
        isEmpty  : {
            errorMessage : "Rating field must not be empty"
         },
         isNumber : {
            errorMessage : "Rating field field must be number"
            }
    },
    size: {
        isEmpty  : {
            errorMessage : "Size field must not be empty"
         },
         isNumber : {
            errorMessage : "Size field field must be string"
            }
    },
    // icon : {
    //     type : String,
    //     required: true
    // },
    // backdrop : {
    //     type :String,
    //     required: true
    // },
    // category : {
    //     type : new Schema.Types.ObjectId,
    //     required : true,
    // }
}