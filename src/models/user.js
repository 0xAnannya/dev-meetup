const mongoose = require('mongoose');

// defining the schema for the user model, schema is a blueprint for the data we want to store in the database
// mongoose.Schema is a constructor function that creates a new schema object
// we are defining the fields that we want to store in the database

const userSchema = new mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    email:{
        type: String
    },
    age:{
        type: Number
    }

})

// creating the model from the schema, model is a constructor function that creates a new model object
const User = mongoose.model("User", userSchema)

module.exports = User;