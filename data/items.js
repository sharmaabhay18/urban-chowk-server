const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const items = mongoCollections.items;
const { isValidString, validateObjectId } = require("../utils/helperFuctions");

const get = async () => {
  try {
    const itemsCollection = await items();
    const allItems = await itemsCollection.find({}).toArray();

    const payload = allItems.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return payload;
  } catch (error) {
    throw {
      status: 404,
      message: "Error while getting item details",
    };
  }
};

const getItemsByObjectId = async (id) => {
  try {
    if (!id) throw { status: 400, message: "Id is required" };

    const parsedId = ObjectId.isValid(id);
    if (!parsedId)
      throw { status: 400, message: "Id passed is not a valid object id" };

    validateObjectId(id);

    const itemsCollection = await items();
    const item = await itemsCollection.find({ categoryId: id }).toArray();

    if (item === null)
      throw { status: 404, message: "No items is present with that id" };

    const result = item.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return result;
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while getting items ${error.message}`,
    };
  }
};

const create = async (payload) => {
  try {
    const { name, description, icon, categoryId, price } = payload;

    if (!name) throw { status: 400, message: "Name is required parameter" };
    if (!icon) throw { status: 400, message: "Icon is required parameter" };
    if (!description)
      throw { status: 400, message: "Description is required parameter" };
    if (!categoryId)
      throw { status: 400, message: "Category id is required parameter" };

    if (!price)
      throw { status: 400, message: "Price id is required parameter" };

    isValidString(name, "Name");
    isValidString(description, "Description");
    isValidString(icon, "Icon");

    validateObjectId(categoryId);

    if (isNaN(price)) {
      throw { status: 404, message: "Price should be of type number" };
    }

    if (price < 0) {
      throw { status: 404, message: "Price should be greater than 0" };
    }

    const itemsCollection = await items();

    const itemsCreated = await itemsCollection.insertOne(payload);
    if (itemsCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create items" };

    return {
      isCreated: true,
    };
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while creating items ${error.message}`,
    };
  }
};

const getItems = async (id) => {
  try {
    if (!id) throw { status: 400, message: "Id is required" };

    const parsedId = ObjectId.isValid(id);
    if (!parsedId)
      throw { status: 400, message: "Id passed is not a valid object id" };

    validateObjectId(id);

    const itemsCollection = await items();
    const item = await itemsCollection.find({ _id: ObjectId(id) }).toArray();
    
    if (item === null || item.length === 0)
      throw { status: 404, message: "No items is present with that id" };

    const catId = item && item[0].categoryId;
    const allItemInCat = await itemsCollection.find({ categoryId: catId }).toArray();

    if (allItemInCat === null)
      throw { status: 404, message: "No items is present with that id" };

    const result = allItemInCat.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return result;
  } catch (error) {
    throw {
      status: error.status,
      message: `${error.message}`,
    };
  }
}

const remove = async (id) => {
  try {
    validateObjectId(id);

    const itemsCollection = await items();

    const deletionInfo = await itemsCollection.deleteOne({
      _id: ObjectId(id),
    });

    if (deletionInfo.deletedCount === 0) {
      throw {
        status: 409,
        message: `Could not delete items with id of ${id}`,
      };
    }
    return { itemsId: id, deleted: true };
  } catch (error) {
    throw {
      status: error.status,
      message: error.message,
    };
  }
};

module.exports = {
  create,
  getItemsByObjectId,
  remove,
  get,
  getItems
};
