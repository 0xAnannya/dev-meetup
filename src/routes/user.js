const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequestSchema");
const { USER_SAFE_INFO } = require("../utils/constants");
const Dog = require("../models/dog");
const userRouter = express.Router();

//get all the pending connection requests
userRouter.get("/user/requests/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_INFO);
    res
      .json({
        message: "Connections fetched successfuly",
        data: connectionRequests,
      })
      .status(200);
  } catch (err) {
    res.status(400).json({ ERROR: err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_INFO)
      .populate("toUserId", USER_SAFE_INFO);

    //populate("fromUserId", USER_SAFE_INFO) will give me only from vale users, therefore we need to also

    //populate only connections details not connectionId details
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.json({ ERROR: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connections = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connections.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserId.toString());
      hideUsersFromFeed.add(connection.toUserId.toString());
    });

    const users = await Dog.find({
      $and: [
        { _id: { $ne: loggedInUser._id } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
      ],
    })
      .select(USER_SAFE_INFO)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    console.error(err);
    res.json({ ERROR: err.message });
  }
});
module.exports = userRouter;
