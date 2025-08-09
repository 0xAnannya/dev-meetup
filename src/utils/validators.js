const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, password, emailId } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (!validator.isEmail(emailId)) {
    throw new error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password is not strong enough. It should contain at least 8 characters, including uppercase, lowercase, numbers, and symbols."
    );
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "skills",
    "age",
    "photoUrl",
    "gender",
    "about",
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
