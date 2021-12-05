const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { isValidString } = require("../utils/helperFuctions");

const getUserByObjectId = async (id) => {
  if (!id) throw { status: 400, message: "Id is required" };

  const parsedId = ObjectId.isValid(id);
  if (!parsedId)
    throw { status: 400, message: "Id passed is not a valid object id" };

  const usersCollection = await users();
  const user = await usersCollection.findOne({ _id: id });
  if (user === null)
    throw { status: 404, message: "No user is present with that id" };

  return user;
};

const create = async (userPayload) => {
  try {
    const { uid, name, authProvider, email } = userPayload;

    if (!name) return throw400Error("Name is required parameter", res);
    if (!authProvider)
      return throw400Error("Auth Provider is required parameter", res);
    if (!email) return throw400Error("Email is required parameter", res);
    if (!uid) return throw400Error("uid is required parameter", res);

    isValidString(name, "Name");
    isValidString(authProvider, "AuthProvider");
    isValidString(email, "Email");

    //check if username is already present in the system
    const usersCollection = await users();
    const user = await usersCollection.findOne({ email: email });
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


