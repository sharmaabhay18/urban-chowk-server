const express = require("express");
const router = express.Router();
const xss = require("xss");

const { couponsCode } = require("../data");

const checkAuth = require("../middleware/check-auth");
const {
  isValidString,
  isAdmin,
  throw400Error,
  validateObjectId,
  handleCatchError,
} = require("../utils/helperFuctions");

router.get("/", async (_, res) => {
  let result;
  try {
    result = await couponsCode.get();
  } catch (err) {
    handleCatchError(error, res);
  }

  return res.json({ success: true, result: { data: result } });
});

router.use(checkAuth);

router.post("/add", async (req, res) => {
  const { code, discount } = req.body;
  const role = req.userData.role;
  const userId = req.userData.userId;

  if (!code) return throw400Error("Code is required parameter", res);
  if (!discount) return throw400Error("Discount is required parameter", res);

  isValidString(code, "Code");
  isValidString(discount, "Discount");

  if (isNaN(discount)) {
    return res.status(400).json({
      success: false,
      message: "Discount should be of type number",
    });
  }

  if (discount < 0 || discount > 100) {
    return res.status(400).json({
      success: false,
      message: "Discount should be in range of 0 to 100",
    });
  }

  xss(code);
  xss(discount);

  try {
    isAdmin(role);

    const payload = {
      code,
      discount,
      userId,
    };

    const coupounCreated = await couponsCode.create(payload);
    return res.json({ success: true, result: { data: coupounCreated } });
  } catch (err) {
    return handleCatchError(err, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.userData.role;

    validateObjectId(id);

    xss(id);

    isAdmin(role);

    const deletedCoupoun = await couponsCode.remove(id);
    return res.json({ success: true, result: { data: deletedCoupoun } });
  } catch (error) {
    handleCatchError(error, res);
  }
});

module.exports = router;
