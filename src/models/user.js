const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // for token generation and verification
const bcrypt = require("bcrypt"); // for password encryption

// defining the schema for the user model, schema is a blueprint for the data we want to store in the database
// mongoose.Schema is a constructor function that creates a new schema object
// we are defining the fields that we want to store in the database

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
    },

    age: {
      type: Number,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true, // this will add createdAt and updatedAt fields to the schema
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEVMeetUpSecretKey", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordValid;
};

// creating the model from the schema, model is a constructor function that creates a new model object
const User = mongoose.model("User", userSchema);

module.exports = User;
