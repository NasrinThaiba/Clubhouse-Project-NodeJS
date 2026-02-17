const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    secondName : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    isMember : {
        type : Boolean,
        default : false,
    },
    isAdmin : {
        type : Boolean,
        default : false,
    }
}, {timestamps : true})

module.exports = mongoose.model("User", userSchema)