const express = require("express");
const router = express.Router();
const xss = require("xss");

const { customerAddress } = require("../data");

const checkAuth = require("../middleware/check-auth");
const {
  isValidString,
  throw400Error,
  validateObjectId,
  handleCatchError,
} = require("../utils/helperFuctions");

router.use(checkAuth);

router.get("/", async (req, res) => {
  const userId = req.userData.userId;
  let result;
  try {
    result = await customerAddress.get(userId);
  } catch (err) {
    return handleCatchError(err, res);
  }

  return res.json({ success: true, result: { data: result } });
});

router.post("/add", async (req, res) => {
  const { address, city, state, pincode, landmark } = req.body;
  const userId = req.userData.userId;

  if (!address) return throw400Error("Address is required parameter", res);
  if (!city) return throw400Error("City is required parameter", res);
  if (!state) return throw400Error("State is required parameter", res);
  if (!pincode) return throw400Error("Pincode is required parameter", res);

  isValidString(address, "Address");
  isValidString(city, "City");
  isValidString(state, "State");
  isValidString(pincode, "Pincode");
  landmark && isValidString(landmark, "Landmark");

  xss(address);
  xss(city);
  xss(state);
  xss(pincode);
  landmark && xss(landmark);

  try {
    const payload = {
      address,
      city,
      state,
      pincode,
      landmark,
      uid: userId,
    };

    const addressCreated = await customerAddress.create(payload);
    return res.json({ success: true, result: { data: addressCreated } });
  } catch (err) {
    return handleCatchError(err, res);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    validateObjectId(id);

    xss(id);

    const deletedCustomer = await customerAddress.remove(id);
    return res.json({ success: true, result: { data: deletedCustomer } });
  } catch (error) {
    return handleCatchError(error, res);
  }
});

module.exports = router;
