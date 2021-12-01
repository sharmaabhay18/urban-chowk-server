const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const items = mongoCollections.items;
const { isValidString } = require("../utils/helperFuctions");

const getItemsByObjectId = async (id) => {
  if (!id) throw { status: 400, message: "Id is required" };

  const parsedId = ObjectId.isValid(id);
  if (!parsedId)
    throw { status: 400, message: "Id passed is not a valid object id" };

  const itemsCollection = await users();
  const item = await itemsCollection.findOne({ _id: id });
  if (item === null)
    throw { status: 404, message: "No items is present with that id" };

  return item;
};

const create = async (userPayload) => {
  try {
    const { name, description, quantityAvailable, packagingType, createdOn, updatedOn, item_id, price } = userPayload;

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
    isValidString(authProvider, "AuthProvider");
    isValidString(email, "Email");

    //check if username is already present in the system
    const itemsCollection = await items();
    const item = await itemsCollection.findOne({ email: email });
    if (user !== null) throw { status: 409, message: "Email already exist!" };

    const userCreated = await usersCollection.insertOne(userPayload);
    if (userCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create user" };

    const newId = userCreated.insertedId;

    const retrievedUser = await getUserByObjectId(newId);

    return {
      name: retrievedUser.name,
      email: retrievedUser.email,
      authProvider: retrievedUser.authProvider,
      uid: retrievedUser.uid,
      _id: retrievedUser?._id?.toString(),
    };
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while creating user ${error.message}`,
    };
  }
};

module.exports = {
  create,
};






