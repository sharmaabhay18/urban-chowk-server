const { ObjectId } = require("mongodb");

const mongoCollections = require("../config/mongoCollections");
const couponsCode = mongoCollections.couponsCode;
const { isValidString, validateObjectId } = require("../utils/helperFuctions");

const get = async () => {
  try {
    const couponsCodeCollection = await couponsCode();

    const allCoupons = await couponsCodeCollection.find({}).toArray();

    const result = allCoupons.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return result;
  } catch (error) {
    throw {
      status: 404,
      message: "Error while getting coupons code details",
    };
  }
};

const create = async (payload) => {
  try {
    const { code, discount } = payload;

    if (!code) throw { status: 400, message: "Code is required parameter" };
    if (!discount)
      throw { status: 400, message: "Discount is required parameter" };

    isValidString(code, "Code");
    isValidString(discount, "Discount");

    const couponsCodeCollection = await couponsCode();
    const codeName = code.toLowerCase();
    const isExist = await couponsCodeCollection.findOne({
      code: codeName,
    });

    const data = {
      code: codeName,
      discount,
    };
    if (isExist !== null)
      throw { status: 409, message: "Coupoun Code already exist!" };

    const couponCreated = await couponsCodeCollection.insertOne(data);
    if (couponCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create coupon code" };

    return {
      isCreated: true,
    };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

const remove = async (id) => {
  try {
    validateObjectId(id);

    const couponsCodeCollection = await couponsCode();

    const deletionInfo = await couponsCodeCollection.deleteOne({
      _id: ObjectId(id),
    });

    if (deletionInfo.deletedCount === 0) {
      throw {
        status: 409,
        message: `Could not delete coupon code with id of ${id}`,
      };
    }
    return { couponId: id, deleted: true };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

module.exports = {
  create,
  get,
  remove,
};
