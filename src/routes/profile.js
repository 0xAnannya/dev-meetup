const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateIsStrongPassword,
} = require("../utils/validators");
const bcrypt = require("bcrypt"); // for password encryption
const Dog = require("../models/dog");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile:", err);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Data Request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach(
      (field) => (loggedInUser[field] = req.body[field])
    );

    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.name} your profile has been updated`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      loggedInUser.password
    );
    if (!isPasswordValid) {
      return res.status(400).send("Old password is incorrect");
    }
    const isStrongPassword = validateIsStrongPassword(newPassword);
    if (!isStrongPassword) {
      return res.status(400).send("Password not strong enough");
    }

    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();

    res.status(200).send("Password Changed Successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.delete("/deleteProfile", async (req, res) => {
  const id = req.body.id;
  try {
    const found = await Dog.findByIdAndDelete(id);
    if (!found) {
      return res.status(404).send("User not found");
    }

    res.send("User deleted successfully");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.get("/users", async (req, res) => {
  try {
    const users = await Dog.find({ name: "Charlie" });
    if (users.length === 0) {
      return res.status(404).send("NO users found");
    }
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = profileRouter;
