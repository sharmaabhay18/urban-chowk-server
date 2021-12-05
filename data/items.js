const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const items = mongoCollections.items;
const { isValidString } = require("../utils/helperFuctions");

const getItemsByObjectId = async (id) => {
  if (!id) throw { status: 400, message: "Id is required" };

  const parsedId = ObjectId.isValid(id);
  if (!parsedId)
    throw { status: 400, message: "Id passed is not a valid object id" };

  const itemsCollection = await itemss();
  const item = await itemsCollection.findOne({ _id: id });
  if (item === null)
    throw { status: 404, message: "No items is present with that id" };

  return item;
};

const create = async (payload) => {
  try {
    const { name, description, quantityAvailable, packagingType, createdOn, updatedOn, item_id, price } = payload;

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

    //check if itemsname is already present in the system
    const itemsCollection = await items();
 
    const itemsCreated = await itemsCollection.insertOne(payload);
    if (itemsCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create items" };


    return {
      isCreated: true
    };
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while creating items ${error.message}`,
    };
  }
};


const remove = async (id) => {
  try {

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
  remove
};






