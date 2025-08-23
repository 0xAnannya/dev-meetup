const jwt = require("jsonwebtoken");
const Dog = require("../models/dog");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login!");
    }

    const decodeObj = await jwt.verify(token, "DEVMeetUpSecretKey");

    const { _id } = decodeObj;

    const dog = await Dog.findById(_id);
    if (!dog) {
      throw new Error("User not found");
    }
    // if found attach it to the request object
    req.user = dog;
    next();
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
};

module.exports = { userAuth };
