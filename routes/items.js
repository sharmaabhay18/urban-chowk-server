const express = require("express");
const router = express.Router();
const xss = require("xss");

const { items } = require("../data");

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
    result = await items.get();
  } catch (err) {
    handleCatchError(error, res);
  }

  return res.json({ success: true, result: { data: result } });
});


router.post("/add", async (req, res) => {
  const { name, description, quantityAvailable, packagingType, createdOn, updatedOn, item_id, price } = payload;
  const role = req.userData.role;
  const userId = req.userData.userId;

  if (!name) return throw400Error("Name is required parameter", res);
    if (!description)
      return throw400Error("Description is required parameter", res);
    if (!quantityAvailable) return throw400Error("Quantity available is required parameter", res);
    if (!packagingType) return throw400Error("Packaging Type is required parameter", res);
    if (!createdOn) return throw400Error("CreatedOn is required parameter", res);
    if (!updatedOn) return throw400Error("UpdatedOn is required parameter", res);
    if (!item_id) return throw400Error("Item id is required parameter", res);
    if (!price) return throw400Error("Price is required parameter", res);


  isValidString(name, "Name");
  isValidString(description, "Description");

  xss(name);
  xss(description);

  try {

    const itemsPayload = {
      name,
      description,
      quantityAvailable, 
      packagingType,
      createdOn, 
      updatedOn, 
      item_id, 
      price 
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