const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt"); // for password encryption
const validator = require("validator"); // for email validation
const cookieParser = require("cookie-parser"); // for handling cookies
const jwt = require("jsonwebtoken"); // for token generation and verification

const app = express();

app.use(express.json()); // to parse JSON bodies
app.use(cookieParser()); // to parse cookies

const User = require("./models/user");
const { validateSignUpData } = require("./utils/validators");
const { userAuth } = require("./middlewares/auth");

// signUp api
app.post("/signUp", async (req, res) => {
  try {
    //validation
    validateSignUpData(req);

    const { firstName, lastName, password, emailId } = req.body;

    // encrpypt password
    const passwordHash = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const user = new User({
      firstName,
      lastName,
      password: passwordHash,
      emailId,
    });

    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error during sign up:", err);
  }
});

//login api
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    //valiadte emailid
    const valid = emailId && validator.isEmail(emailId);

    if (!valid) {
      throw new Error("Invalid email address");
    }

    const user = await User.findOne({ emailId });
    if (!user) {
      throw new error("Invalid credentials");
    }

    //password compare
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT(); // generate JWT token

      // on production use hhtpOnly: true, 
      res.cookie("token", token,{expires: new Date(Date.now() + 8 * 3600000)});
      res.send("Login successful");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send(err.message + " Internal Server Error");
  }
});

//get profile api
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Fetching user profile", user);

    res.send(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
  }
});

//send connection request

app.post("/sendConnectionRequest",userAuth, async (req, res) => {
    try{

        res.send("Connection request sent successfully");

    }catch(err){
    console.error("Error sending connection request:", err);
    res.status(500).send("Internal Server Error");
    }
})


app.get("/users", async (req, res) => {
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

app.patch("/users", async (req, res) => {
  const id = req.body.id;

  try {
    console.log("Updating user with id:", id);
    await User.findByIdAndUpdate(id, { firstName: "I am changed" });
    res.send("User updated successfully");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/users", async (req, res) => {
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

// app.post


connectDB()
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(7777, () => {
      console.log("listening to 7777");
    });
  })
  .catch((err) => {
    console.error("err connecting to MongoDB:", err);
  });
