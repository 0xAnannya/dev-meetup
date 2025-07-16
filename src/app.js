const express= require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app= express();

app.use(express.json()); // to parse JSON bodies

app.post('/signUp',async (req, res)=>{

    console.log(req.body)

    const user = new User(req.body)

    await user.save();
    res.send("User created successfully");
})

connectDB().then(()=>{
    console.log("Connected to MongoDB");

    app.listen(7777,(()=>{
        console.log("listening to 3000")
    }))
}).catch((err)=>{
    console.error("err connecting to MongoDB:", err);
})
