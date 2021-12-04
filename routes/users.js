const express = require("express");
const xss = require("xss");
const { getAuth } = require("firebase-admin/auth");

const router = express.Router();
const { users } = require("../data");
const {
  isValidString,
  throw400Error,
  handleCatchError,
} = require("../utils/helperFuctions");

//User routes
router.post("/register", async (req, res) => {
  try {
    const { uid, name, authProvider, email, mobile, role } = req.body;
    let userRole = "customer";
    if (!!role) {
      userRole = role;
    }
    if (!name) return throw400Error("Name is required parameter", res);
    if (!authProvider)
      return throw400Error("Auth Provider is required parameter", res);
    if (!email) return throw400Error("Email is required parameter", res);
    if (!uid) return throw400Error("uid is required parameter", res);
    if (!mobile) return throw400Error("Mobile is required parameter", res);

    isValidString(name, "Name");
    isValidString(authProvider, "AuthProvider");
    isValidString(email, "Email");

    xss(name);
    xss(authProvider);
    xss(email);
    xss(mobile);
    xss(userRole);

    const emailAddress = email.toLowerCase();

    const userPayload = {
      uid,
      name,
      email: emailAddress,
      authProvider,
      mobile,
      role: userRole,
    };

    const userCreated = await users.create(userPayload);

    return res.status(200).json(userCreated);
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.get("/login", async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    getAuth()
      .verifyIdToken(token)
      .then(async (decodedToken) => {
        const uid = decodedToken.uid;

        try {
          const isUserPresent = await users.getUserByUId(uid);

          let role = "";
          if (isUserPresent.role === "admin") {
            role = "admin";
          } else {
            role = "customer";
          }

          if (!isUserPresent) {
            return res.status(401).json({
              success: false,
              result: {
                error: "Invalid Credentials Unauthorized",
              },
            });
          }

          return res.status(200).json({ success: true, data: { role } });
        } catch (err) {
          return res
            .status(400)
            .json({ success: false, result: { error: err } });
        }
      })
      .catch(() => {
        return res.status(401).json({
          success: false,
          result: { error: "Unauthorized User" },
        });
      });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
