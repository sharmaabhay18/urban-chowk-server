const express = require("express");
const router = express.Router();
const xss = require("xss");

const { items } = require("../data");
const checkAuth = require("../middleware/check-auth");

const {
  isValidString,
  isAdmin,
  throw400Error,
  validateObjectId,
  handleCatchError,
} = require("../utils/helperFuctions");

router.get("/:categoryId", async (req, res) => {
  let result;
  try {
    const { categoryId } = req.params;

    validateObjectId(categoryId);

    xss(categoryId);

    result = await items.getItemsByObjectId(categoryId);
  } catch (err) {
    handleCatchError(error, res);
  }

  return res.json({ success: true, result: { data: result } });
});

router.use(checkAuth);

router.post("/add", async (req, res) => {
  const { name, description, categoryId, price, icon } = req.body;
  const role = req.userData.role;
  const userId = req.userData.userId;

  if (!name) return throw400Error("Name is required parameter", res);
  if (!description)
    return throw400Error("Description is required parameter", res);
  if (!categoryId)
    return throw400Error("Category id is required parameter", res);
  if (!icon) return throw400Error("Icon id is required parameter", res);
  if (!price) return throw400Error("Price is required parameter", res);

  isValidString(icon, "Icon");
  isValidString(name, "Name");
  isValidString(description, "Description");

  if (isNaN(price)) {
    return res.status(400).json({
      success: false,
      message: "Price should be of type number",
    });
  }

  if (price < 0) {
    return res.status(400).json({
      success: false,
      message: "Price should be greater than 0",
    });
  }

  validateObjectId(categoryId);

  xss(name);
  xss(description);
  xss(categoryId);
  xss(price);
  xss(icon);

  try {
    isAdmin(role);

    const itemsPayload = {
      name,
      description,
      categoryId,
      price,
      uid: userId,
      icon,
    };

    const itemsCreated = await items.create(itemsPayload);
    return res.json({ success: true, result: { data: itemsCreated } });
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

    const itemsCreated = await items.remove(id);
    return res.json({ success: true, result: { data: itemsCreated } });
  } catch (error) {
    handleCatchError(error, res);
  }
});

module.exports = router;
