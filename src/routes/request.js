const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

//send connection request

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send("Connection request sent successfully");
  } catch (err) {
    console.error("Error sending connection request:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = requestRouter;
