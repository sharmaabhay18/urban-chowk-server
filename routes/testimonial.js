const express = require("express");
const router = express.Router();
const xss = require("xss");

const { testimonials } = require("../data");

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
    result = await testimonials.get();
  } catch (err) {
    return handleCatchError(err, res);
  }

  return res.json({ success: true, result: { data: result } });
});

router.use(checkAuth);

router.post("/add", async (req, res) => {
  const { name, icon, description, image_url } = req.body;
  const role = req.userData.role;
  const userId = req.userData.userId;

  if (!name) return throw400Error("Name is required parameter", res);
  if (!icon) return throw400Error("Icon is required parameter", res);
  if (!description)
    return throw400Error("Description is required parameter", res);
  if (!image_url) return throw400Error("Image_url is required parameter", res);

  isValidString(name, "Name");
  isValidString(icon, "Icon");
  isValidString(description, "Description");
  isValidString(image_url, "Image_url");

  xss(name);
  xss(icon);
  xss(description);
  xss(image_url);
  try {
    isAdmin(role);

    const testimonialPayload = {
      name,
      icon,
      description,
      image_url,
      userId,
    };

    const testimonialCreated = await testimonials.create(testimonialPayload);
    return res.json({ success: true, result: { data: testimonialCreated } });
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

    const testimonialCreated = await testimonials.remove(id);
    return res.json({ success: true, result: { data: testimonialCreated } });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
