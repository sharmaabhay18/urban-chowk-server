const { ObjectId } = require("mongodb");

const mongoCollections = require("../config/mongoCollections");
const category = mongoCollections.category;
const { isValidString, validateObjectId } = require("../utils/helperFuctions");

const get = async () => {
  try {
    const categoryCollection = await category();
    const allcategory = await categoryCollection.find({}).toArray();

    const payload = allcategory.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return payload;
  } catch (error) {
    throw {
      status: 404,
      message: "Error while getting category details",
    };
  }
};

const create = async (payload) => {
  try {
    const { name, totalItemAvailable, from } = payload;

    if (!name) throw { status: 400, message: "Name is required parameter" };
    if (!totalItemAvailable) throw { status: 400, message: "totalItemAvailable is required parameter" };
    if (!from)
      throw { status: 400, message: "from is required parameter" };

    isValidString(name, "Name");
    isValidString(totalItemAvailable, "totalItemAvailable");
    isValidString(from, "from");

    const categoryCollection = await category();

    const categoryCreated = await categoryCollection.insertOne(payload);
    if (categoryCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create category" };

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

    const categoryCollection = await category();
    const deletionInfo = await categoryCollection.deleteOne({
      _id: ObjectId(id),
    });

    if (deletionInfo.deletedCount === 0) {
      throw {
        status: 409,
        message: `Could not delete category with id of ${id}`,
      };
    }
    return { categoryId: id, deleted: true };
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