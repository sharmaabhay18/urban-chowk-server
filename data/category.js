
const express = require("express");
const xss = require("xss");

const router = express.Router();
const { users } = require(".");
const { isValidString } = require("../utils/helperFuctions");

const throw400Error = (key, res) =>
  res.status(400).json({ message: `${key} is required parameter` });

const handleCatchError = (error, res) => {
  const statusCode = error?.status || 500;
  const errorMessage = error?.message || "Something went wrong!";

  return res.status(statusCode).json({ message: errorMessage });
};

//User routes
router.post("/category", async (req, res) => {
  try {
    const { uid, name, totalItemAvailable, from } = req.body;

    if (!name) return throw400Error("Name is required parameter", res);
    if (!totalItemAvailable)
      return throw400Error("Total Item Available is required parameter", res);
    if (!from) return throw400Error("From is required parameter", res);
    if (!uid) return throw400Error("uid is required parameter", res);

    isValidString(name, "Name");
    isValidString(from, "AuthProvider");
    isValidString(totalItemAvailable, "Email");

    xss(name);
    xss(totalItemAvailable);
    xss(from);

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
