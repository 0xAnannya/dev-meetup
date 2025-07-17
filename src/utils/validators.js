const validator = require("validator")

const validateSignUpData=(req)=>{
    const {firstName, lastName, password, emailId}= req.body;

    if(!firstName || !lastName ){
      throw new Error("First name and last name are required");
    }

    else if(!validator.isEmail(emailId)){
        throw new error("Invalid email address")
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not strong enough. It should contain at least 8 characters, including uppercase, lowercase, numbers, and symbols.");
    }

}


module.exports = {validateSignUpData}