const express = require("express");
const xss = require("xss");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const { category } = require("../data");
const {
  isValidString,
  isAdmin,
  throw400Error,
  handleCatchError,
  validateObjectId,
} = require("../utils/helperFuctions");

router.get("/", async (_, res) => {
  let result;
  try {
    result = await category.get();
  } catch (err) {
    return handleCatchError(err, res);
  }

  return res.json({ success: true, result: { data: result } });
});

router.use(checkAuth);

router.post("/add", async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const userId = req.userData.userId;
    const role = req.userData.role;

    if (!name) return throw400Error("Name is required parameter", res);
    if (!icon) return throw400Error("Icon is required parameter", res);
    if (!description)
      return throw400Error("Description is required parameter", res);

    isValidString(name, "Name");
    isValidString(icon, "Icon");
    isValidString(description, "Description");

    xss(name);
    xss(description);
    xss(icon);

    isAdmin(role);

    const catName = name.toLowerCase();

    const payload = { uid: userId, name: catName, icon, description };

    const categoryCreated = await category.create(payload);

    return res
      .status(200)
      .json({ success: true, result: { data: categoryCreated } });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.userData.role;

    validateObjectId(id);

    xss(id);

    isAdmin(role);

    const categoryDeleted = await category.remove(id);
    return res.json({ success: true, result: { data: categoryDeleted } });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
