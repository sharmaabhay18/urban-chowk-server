const { ObjectId } = require("mongodb");

const mongoCollections = require("../config/mongoCollections");
const customerAddress = mongoCollections.customerAddress;
const { isValidString, validateObjectId } = require("../utils/helperFuctions");

const get = async (uid) => {
  try {
    const customerAddressCollection = await customerAddress();

    const payload = await customerAddressCollection
      .find({ uid: uid })
      .toArray();

    if (payload === null)
      throw { status: 404, message: "No address is present with that uid" };

    const result = payload.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return result;
  } catch (error) {
    throw {
      status: 404,
      message: "Error while getting testimonial details",
    };
  }
};

const create = async (payload) => {
  try {
    const { address, city, state, pincode, landmark } = payload;

    if (!address)
      throw { status: 400, message: "Address is required parameter" };
    if (!city) throw { status: 400, message: "City is required parameter" };
    if (!state) throw { status: 400, message: "State is required parameter" };
    if (!pincode)
      throw { status: 400, message: "Pincode is required parameter" };

    isValidString(address, "Address");
    isValidString(city, "City");
    isValidString(state, "State");
    isValidString(pincode, "Pincode");
    landmark && isValidString(landmark, "Landmark");

    const customerAddressCollection = await customerAddress();

    const addressCreated = await customerAddressCollection.insertOne(payload);
    if (addressCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create customer address" };

    return await get(payload.uid);
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

    const customerAddressCollection = await customerAddress();

    const deletionInfo = await customerAddressCollection.deleteOne({
      _id: ObjectId(id),
    });

    if (deletionInfo.deletedCount === 0) {
      throw {
        status: 409,
        message: `Could not delete customer address with id of ${id}`,
      };
    }
    return { customerAddId: id, deleted: true };
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
