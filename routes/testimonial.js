const express = require("express");
const router = express.Router();
const xss = require("xss");

const bluebird = require("bluebird");
const redis = require("redis");

const { testimonials } = require("../data");

const checkAuth = require("../middleware/check-auth");
const {
  isValidString,
  isAdmin,
  throw400Error,
  validateObjectId,
  handleCatchError,
} = require("../utils/helperFuctions");

const client = redis.createClient(6379, 'redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const TESTIMONIAL = "TESTIMONIAL";

router.get("/", async (_, res) => {
  let result;
  try {

    const isCached = await client.existsAsync(TESTIMONIAL);

    if (isCached) {
      console.log("Getting testimonial data from cache!");
      const testData = await client.getAsync(TESTIMONIAL);
      return res.json({ success: true, result: { data: JSON.parse(testData) } });
    }

    result = await testimonials.get();

    console.log("Caching all testimonial data");
    result && await client.setAsync(TESTIMONIAL, JSON.stringify(result));

    return res.json({ success: true, result: { data: result } });
  } catch (err) {
    return handleCatchError(err, res);
  }
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

    console.log("Caching new testimonial data");
    testimonialCreated && await client.setAsync(TESTIMONIAL, JSON.stringify(testimonialCreated?.testimonials));

    return res.json({ success: true, result: { data: { isCreater: testimonialCreated?.isCreated } } });
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

    const updatedTestimonial = await testimonials.remove(id);

    console.log("Caching testimonial data after deleting");
    updatedTestimonial && await client.setAsync(TESTIMONIAL, JSON.stringify(updatedTestimonial?.testimonials));

    return res.json({
      success: true, result: {
        data: {
          deleted: updatedTestimonial.deleted, testimonialId: updatedTestimonial.testimonialId
        }
      }
    });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
