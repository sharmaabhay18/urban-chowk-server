const express = require("express");
const router = express.Router();
const xss = require("xss");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const { order, users } = require("../data");
const checkAuth = require("../middleware/check-auth");

const {
  isAdmin,
  throw400Error,
  handleCatchError,
} = require("../utils/helperFuctions");

router.use(checkAuth);

router.get("/all", async (req, res) => {
  let result;
  try {
    const role = req.userData.role;
    isAdmin(role);

    result = await order.getAll();
  } catch (err) {
    return handleCatchError(err, res);
  }

  return res.json({ success: true, result: { data: result } });
});

router.get("/", async (req, res) => {
  let result;
  try {
    const userId = req?.userData?.userId;

    result = await order.get(userId);
  } catch (err) {
    return handleCatchError(err, res);
  }

  return res.json({ success: true, result: { data: result } });
});

router.post("/add", async (req, res) => {
  const { itemPayload, selectedAddress, totalCost } = req.body;

  const userId = req.userData.userId;

  if (!itemPayload)
    return throw400Error("ItemPayload is required parameter", res);
  if (!selectedAddress)
    return throw400Error("SelectedAddress is required parameter", res);

  if (!totalCost) return throw400Error("Total Cost is required parameter", res);

  if (!Array.isArray(itemPayload))
    return throw400Error("ItemPayload should be of type array of objects", res);

  if (itemPayload.length === 0)
    return throw400Error("ItemPayload should have at least one object", res);

  if (Object.keys(selectedAddress).length === 0)
    return throw400Error("Please select valid address", res);

  const addressValue = Object.values(selectedAddress);

  addressValue.map((address) => {
    if (typeof address !== "string")
      return throw400Error("Address value should be of type string", res);
  });

  if (isNaN(totalCost)) {
    return res.status(400).json({
      success: false,
      message: "TotalCost should be of type number",
    });
  }

  if (totalCost < 0) {
    return res.status(400).json({
      success: false,
      message: "TotalCost should be greater than 0",
    });
  }

  xss(itemPayload);
  xss(selectedAddress);
  xss(totalCost);

  try {
    const payload = {
      itemPayload,
      selectedAddress,
      totalCost,
      uid: userId,
      status: "PENDING",
      created_on: new Date()
    };

    const orderCreated = await order.create(payload);
    if (orderCreated.isCreated) {
      const userData = await users.getUserByUId(userId);

      let transporter = nodemailer.createTransport(
        nodemailerSendgrid({
          apiKey: process.env.SENDGRID_API_KEY,
        })
      );

      let deliveryAddress =
        selectedAddress.address +
        " " +
        selectedAddress.city +
        " " +
        selectedAddress.state +
        " " +
        selectedAddress.pincode;

      await transporter.sendMail({
        from: '"Uraban Chowk" <abhaay18@gmail.com>', // sender address
        to: userData.email, // list of receivers
        subject: "Order Placed Successfully ✔", // Subject line
        html: `
        <h2>Hey ${userData.name} ,</h2>
        <p>Your delivery order is placed and being prepared and will be delivered on below address.</p>
        <p>Address - ${deliveryAddress}</p>
        <p>Status - Pending</p>
        <p>Total - $ ${totalCost}</p>
        <h2>Thank You,</h2>
        <h2>Urban Chowk Team</h2>
        `,
      });
    }
    return res.json({ success: true, result: { data: orderCreated } });
  } catch (err) {
    return handleCatchError(err, res);
  }
});

module.exports = router;
