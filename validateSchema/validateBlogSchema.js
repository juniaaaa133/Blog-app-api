exports.validateBlogSchema = {
    title : {
        notEmpty  : {
        errorMessage : "Title must not be empty"
        }
    },
    intro : {
        notEmpty  : {
            errorMessage : "Overview must not be empty"
               }
    },
    overview : {
        notEmpty  : {
         errorMessage : "Overview must not be empty"
            }
    },
    releasedDate : {
        notEmpty  : {
            errorMessage : "Released Date must not be empty"
         }
    },
    gameUrl : {
        notEmpty  : {
            errorMessage : "Url must not be empty"
         }
    },
    rating : {
        notEmpty  : {
            errorMessage : "Rating field must not be empty"
         }
    },
    size: {
        notEmpty  : {
            errorMessage : "Size field must not be empty"
         }
    },
    categories : {
        notEmpty  : {
            errorMessage : "Category field must not be empty"
         }
    }
}