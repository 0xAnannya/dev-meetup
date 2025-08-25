const validator = require("validator");

const validateSignUpData = (req) => {
  const { name, breed, password, emailId } = req.body;

  if (!name) {
    throw new Error("Name required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  } else if (!breed) {
    throw new Error("Breed required");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong enough. It should contain at least 8 characters, including uppercase, lowercase, numbers, and symbols."
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "name",
    "emailId",
    "breed",
    "age",
    "photoUrl",
    "gender",
    "about",
    "location",
  ];
  const IsEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );
  return IsEditAllowed;
};

const validateIsStrongPassword = (password) => {
  if (!validator.isStrongPassword(password)) {
    return false;
  }
  return true;
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateIsStrongPassword,
};
