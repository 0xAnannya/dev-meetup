const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // for token generation and verification
const bcrypt = require("bcrypt"); // for password encryption
const validator = require("validator");

// defining the schema for the user model, schema is a blueprint for the data we want to store in the database
// mongoose.Schema is a constructor function that creates a new schema object
// we are defining the fields that we want to store in the database

const dogSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      max: 50,
    },
    breed: {
      type: String,
      required: true,
    },

    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password is not strong enough. It should contain at least 8 characters, including uppercase, lowercase, numbers, and symbols."
          );
        }
      },
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female"],
        message: `{VALUE} is incorrect value`,
      },
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: "Default About",
    },
    location: {
      type: String,
      //   required: true,
    },
  },
  {
    timestamps: true, // this will add createdAt and updatedAt fields to the schema
  }
);

dogSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEVMeetUpSecretKey", {
    expiresIn: "7d",
  });
  return token;
};

dogSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    user.password
  );
  return isPasswordValid;
};

// creating the model from the schema, model is a constructor function that creates a new model object
const Dog = mongoose.model("Dog", dogSchema);

module.exports = Dog;
