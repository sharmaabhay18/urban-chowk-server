const express = require("express");
const xss = require("xss");

const router = express.Router();

const bluebird = require("bluebird");
const redis = require("redis");

const checkAuth = require("../middleware/check-auth");
const { category } = require("../data");
const {
  isValidString,
  isAdmin,
  throw400Error,
  handleCatchError,
  validateObjectId,
} = require("../utils/helperFuctions");

const client = redis.createClient(6379, 'redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const CATEGORY = "CATEGORY";

router.get("/", async (_, res) => {
  let result;
  try {
    const isCached = await client.existsAsync(CATEGORY);

    if (isCached) {
      console.log("Getting category data from cache!");
      const categoryData = await client.getAsync(CATEGORY);
      return res.json({ success: true, result: { data: JSON.parse(categoryData) } });
    }

    result = await category.get();

    console.log("Caching all category data");
    result && await client.setAsync(CATEGORY, JSON.stringify(result));

    return res.json({ success: true, result: { data: result } });

  } catch (err) {
    return handleCatchError(err, res);
  }
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

    console.log("Caching new category data");
    categoryCreated && await client.setAsync(CATEGORY, JSON.stringify(categoryCreated?.categories));

    return res
      .status(200)
      .json({ success: true, result: { data: { isCreated: categoryCreated.isCreated } } });
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

    console.log("Caching category data after deleting");
    categoryDeleted && await client.setAsync(CATEGORY, JSON.stringify(categoryDeleted?.categories));

    return res.json({ success: true, result: { data: { deleted: categoryDeleted.deleted, categoryId: categoryDeleted.categoryId } } });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
