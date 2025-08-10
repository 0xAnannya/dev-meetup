const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequestSchema");

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
      const toUser = await User.findById(toUserId);
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
      const data = await connectionRequest.save();
      res.json({
        message:
          status == "interested"
            ? req.user.firstName +
              " Sent Connection Request to " +
              toUser.firstName
            : req.user.firstName + " ignored" + toUser.firstName,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

module.exports = requestRouter;
