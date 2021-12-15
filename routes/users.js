const express = require("express");
const xss = require("xss");
const { getAuth } = require("firebase-admin/auth");

const router = express.Router();

const checkAuth = require("../middleware/check-auth");
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

    if (isNaN(mobile)) {
      return res.status(400).json({
        success: false,
        result: { error: "Phone number should be of type number" },
      });
    }

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

router.post("/checkMobile", async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return throw400Error("Mobile is required parameter", res);

    if (isNaN(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Phone number should be of type number",
      });
    }
    isValidString(mobile, "Mobile");
    const isValidPhoneNumber = /^\d{10}$/.test(Number(mobile));
    if (!isValidPhoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number is not valid",
      });
    }
    xss(mobile);

    const result = await users.checkMobile(mobile);
    return res.status(200).json({ success: true, data: { result } });
  } catch (err) {
    return handleCatchError(err, res);
  }
});

router.use(checkAuth);

router.get("/", async (req, res) => {
  try {
    const userId = req.userData.userId;
    const result = await users.getUserByUId(userId);
    return res.status(200).json({ success: true, data: { result } });
  } catch (err) {
    return handleCatchError(err, res);
  }
});

router.patch("/", async (req, res) => {
  try {
    const userId = req.userData.userId;
    let payload;
    if (req.body.name && !req.body.mobile) {
      isValidString(req.body.name, "Name");
      xss(req.body.name);
      payload = { name: req.body.name };
    } else if (req.body.name && req.body.mobile) {
      if (isNaN(req.body.mobile)) {
        return res.status(400).json({
          success: false,
          result: { error: "Phone number should be of type number" },
        });
      }

      isValidString(req.body.name, "Name");
      isValidString(req.body.mobile, "Mobile");
      xss(req.body.name);
      xss(req.body.mobile);
      payload = { name: req.body.name, mobile: req.body.mobile };
    } else if (req.body.mobile && !req.body.name) {
      if (isNaN(req.body.mobile)) {
        return res.status(400).json({
          success: false,
          result: { error: "Phone number should be of type number" },
        });
      }
      isValidString(req.body.mobile, "Mobile");
      xss(req.body.mobile);
      payload = { mobile: req.body.mobile };
    } else {
      return res.status(400).json({
        success: false,
        result: { error: "Mandatory Field is required" },
      });
    }
    const updatedUser = await users.update(payload, userId);
    return res.status(200).json({ success: true, data: { updatedUser } });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
