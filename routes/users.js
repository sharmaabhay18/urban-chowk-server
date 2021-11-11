const express = require("express");
const xss = require("xss");

const router = express.Router();
const { users } = require("../data");
const { isValidString } = require("../utils/helperFuctions");

const throw400Error = (key, res) =>
  res.status(400).json({ message: `${key} is required parameter` });

const handleCatchError = (error, res) => {
  const statusCode = error?.status || 500;
  const errorMessage = error?.message || "Something went wrong!";

  return res.status(statusCode).json({ message: errorMessage });
};

//User routes
router.post("/register", async (req, res) => {
  try {
    const { uid, name, authProvider, email } = req.body;

    if (!name) return throw400Error("Name is required parameter", res);
    if (!authProvider)
      return throw400Error("Auth Provider is required parameter", res);
    if (!email) return throw400Error("Email is required parameter", res);
    if (!uid) return throw400Error("uid is required parameter", res);

    isValidString(name, "Name");
    isValidString(authProvider, "AuthProvider");
    isValidString(email, "Email");

    xss(name);
    xss(authProvider);
    xss(email);

    const emailAddress = email.toLowerCase();

    const userPayload = { uid, name, email: emailAddress, authProvider };

    const userCreated = await users.create(userPayload);

    // req.session.user = userCreated;

    return res.status(200).json(userCreated);
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
