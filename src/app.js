const express= require('express');

const app= express();

app.listen(3000, () => {console.log("hey i m listening on port 3000")});

app.use("/ok", (req,res)=>{
    res.send("hello from the server")
})
