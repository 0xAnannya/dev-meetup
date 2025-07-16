const express= require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const app= express();

app.use(express.json()); // to parse JSON bodies



app.post('/signUp',async (req, res)=>{

    const user = new User(req.body)

    await user.save();
    res.send("User created successfully");
})

app.get('/users', async (req, res)=>{
    try {
        const users = await User.find({firstName: "Anannya"});
        console.log("Fetched users:", users);
        if(users.length ===0){
            return res.status(404).send("NO users found")
        }
        res.send(users);


        
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
})

 app.patch('/users', async(req, res)=>{
    const id= req.body.id;
    
    try{
console.log("Updating user with id:", id);
         await User.findByIdAndUpdate(id, {firstName:"I am changed"})
        res.send("User updated successfully");

    }catch(err){
            res.status(500).send("Internal Server Error");
    }
 })

app.delete('/users', async (req, res)=>{
    const id = req.body.id;
    try{
       const found= await User.findByIdAndDelete(id);
       console.log(found)
       if(!found){
           return res.status(404).send("User not found");
        }

        res.send("User deleted successfully");
    }
    catch(err){
        console.error ("Error deleting user:", err);
        res.status(500).send("Internal Server Error");
    }
})

// app.post



connectDB().then(()=>{
    console.log("Connected to MongoDB");

    app.listen(7777,(()=>{
        console.log("listening to 7777")
    }))
}).catch((err)=>{
    console.error("err connecting to MongoDB:", err);
})
