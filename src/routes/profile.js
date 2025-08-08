const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
  }
});

profileRouter.patch("/users", async (req, res) => {
  const id = req.body.id;

  try {
    console.log("Updating user with id:", id);
    await User.findByIdAndUpdate(id, { firstName: "I am changed" });
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

profileRouter.delete("/users", async (req, res) => {
  const id = req.body.id;
  try {
    const found = await User.findByIdAndDelete(id);
    console.log(found);
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
    const users = await User.find({ firstName: "Anannya" });
    console.log("Fetched users:", users);
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
