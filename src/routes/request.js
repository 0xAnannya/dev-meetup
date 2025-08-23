const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequestSchema");
const Dog = require("../models/dog");

const requestRouter = express.Router();

//send connection request

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //status should be valid
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid Status of the request");
      }

      //toUser must exist
      const toUser = await Dog.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      //if you have already sent a req or the recepient has already sent you req
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        res.status(400).json({ message: "Connection request already exists" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.json({
        message:
          status == "interested"
            ? req.user.name + " Sent Connection Request to " + toUser.name
            : req.user.name + " ignored " + toUser.name,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { requestId, status } = req.params;
      const loggedInUser = req.user;

      //status should be valid
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.json({ message: "Status not valid" }).status(404);
      }
      const connectioRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser._id,
      });

      if (!connectioRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }
      const fromUser = await Dog.findById(connectioRequest.fromUserId);

      connectioRequest.status = status;
      await connectioRequest.save();
      res.json({
        message:
          loggedInUser.name +
          " " +
          status +
          " the request from " +
          fromUser.name,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

module.exports = requestRouter;
