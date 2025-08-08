const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt"); // for password encryption
const { validateSignUpData } = require("../utils/validators");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    //validation
    validateSignUpData(req);

    const { firstName, lastName, password, emailId } = req.body;

    //encrypt password
    const passwordHash = await bcrypt.hash(password, 10); //10 is salt rounds
    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
    });
    await user.save();
    res.send("User created successfully");
  } catch (error) {
    console.error("Error during sign up:", err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //validate email
    const valid = emailId && validator.isEmail(emailId);
    if (!valid) {
      throw new Error("Invalid email");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new error("Invalid credentials");
    }
    //password compare
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT(); // generate JWT token

      // on production use hhtpOnly: true
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 360000),
      });
      res.send("login successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    console.error("Error during login:", e);
    res.status(500).send(e + " Internal Server Error");
  }
});

module.exports = authRouter;
