
const express = require("express");
const xss = require("xss");

const router = express.Router();
const { category } = require("../data");
const { isValidString } = require("../utils/helperFuctions");

const throw400Error = (key, res) =>
  res.status(400).json({ message: `${key} is required parameter` });

const handleCatchError = (error, res) => {
  const statusCode = error?.status || 500;
  const errorMessage = error?.message || "Something went wrong!";

  return res.status(statusCode).json({ message: errorMessage });
};


router.get("/", async (_, res) => {
    let result;
    try {
      result = await category.get();
    } catch (err) {
      handleCatchError(error, res);
    }
  
    return res.json({ success: true, result: { data: result } });
  });


router.post("/category", async (req, res) => {
  try {
    const { name, totalItemAvailable, from } = req.body;

    if (!name) return throw400Error("Name is required parameter", res);
    if (!totalItemAvailable)
      return throw400Error("Total Item Available is required parameter", res);
    if (!from) return throw400Error("From is required parameter", res);

    isValidString(name, "Name");
    isValidString(from, "AuthProvider");
    isValidString(totalItemAvailable, "Email");

    xss(name);
    xss(totalItemAvailable);
    xss(from);

    const emailAddress = email.toLowerCase();

    const itemPayload = { uid, name, email: emailAddress, authProvider };

    const itemCreated = await items.create(itemPayload);


    return res.status(200).json(itemCreated);
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
