const { getAuth } = require("firebase-admin/auth");
const { users } = require("../data");

module.exports = async (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  let token;
  try {
    token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
  } catch (err) {
    return res.status(401).json({
      success: false,
      result: {
        error: "Not Authorized",
      },
    });
  }
  if (!token) {
    return res.status(401).json({
      success: false,
      result: {
        error: "Authentication Failed",
      },
    });
  }

  getAuth()
    .verifyIdToken(token)
    .then(async (decodedToken) => {
      const uid = decodedToken.uid;

      let existingUser;
      try {
        existingUser = await users.getUserByUId(uid);
      } catch (err) {
        return res.json({ success: false, result: { error: err } });
      }

      if (!existingUser) {
        return res.status(401).json({
          success: false,
          result: {
            error: "Invalid Credentials Unauthorized",
          },
        });
      }
      req.userData = { userId: existingUser.uid, role: existingUser.role };
      next();
    })
    .catch(() => {
      return res.status(401).json({
        success: false,
        result: { error: "Unauthorized User" },
      });
    });
};
