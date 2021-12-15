const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const order = mongoCollections.order;


const getAll = async () => {
  try {
    const orderCollection = await order();
    const allOrder = await orderCollection.find({}).toArray();

    const payload = allOrder.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return payload;
  } catch (error) {
    throw {
      status: 404,
      message: "Error while getting order details",
    };
  }
};

const get = async (id) => {
  try {
    if (!id) throw { status: 400, message: "Id is required" };

    const orderCollection = await order();
    const orderData = await orderCollection.find({ uid: id }).toArray();

    if (orderData === null)
      throw { status: 404, message: "No order is present with that id" };

    const result = orderData.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return result;
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while getting order ${error.message}`,
    };
  }
};

const create = async (payload) => {
  try {
    const { itemPayload, selectedAddress, totalCost } = payload;

    if (!itemPayload)
      throw { status: 400, message: "ItemPayload id is required parameter" };
    if (!selectedAddress)
      throw {
        status: 400,
        message: "SelectedAddress id is required parameter",
      };
    if (!totalCost)
      throw { status: 400, message: "TotalCost id is required parameter" };

    if (!Array.isArray(itemPayload))
      throw {
        status: 400,
        message: "ItemPayload should be of type array of objects",
      };

    if (itemPayload.length === 0)
      throw {
        status: 400,
        message: "ItemPayload should have at least one object",
      };

    if (Object.keys(selectedAddress).length === 0)
      throw {
        status: 400,
        message: "Please select valid address",
      };

    const addressValue = Object.values(selectedAddress);

    addressValue.map((address) => {
      if (typeof address !== "string")
        throw {
          status: 400,
          message: "Address value should be of type string",
        };
    });

    if (isNaN(totalCost)) {
      throw { status: 404, message: "TotalCost should be of type number" };
    }

    if (totalCost < 0) {
      throw { status: 404, message: "TotalCost should be greater than 0" };
    }

    const orderCollection = await order();

    const orderCreated = await orderCollection.insertOne(payload);
    if (orderCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create order" };

    return {
      isCreated: true,
    };
  } catch (error) {
    throw {
      status: error.status,
      message: `Error while creating order ${error.message}`,
    };
  }
};

const getOrderByObjectId = async (id) => {
  try {
    if (!id) throw { status: 400, message: "Id is required" };

    const parsedId = ObjectId.isValid(id);
    if (!parsedId)
      throw { status: 400, message: "Id passed is not a valid object id" };

    const orderCollection = await order();
    const orderData = await orderCollection.findOne({ _id: ObjectId(id) });

    if (orderData === null)
      throw { status: 404, message: "No order is present with that id" };

    return orderData;
  } catch (error) {
    throw {
      status: error.status,
      message: `${error.message}`,
    };
  }
};


const update = async (orderPayload, id) => {
  try {
    if (!id) throw { status: 400, message: "Id is required" };

    const parsedId = ObjectId.isValid(id);
    if (!parsedId)
      throw { status: 400, message: "Id passed is not a valid object id" };

    const orderCollection = await order();
    const updatedOrder = await orderCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: orderPayload }
    );

    if (!updatedOrder.matchedCount && !updatedOrder.modifiedCount)
      throw "Could not update order";

    const orderDetails = await getOrderByObjectId(id);

    return {
      isUpdated: true,
      uid: orderDetails?.uid
    };
  } catch (error) {
    throw {
      status: error.status,
      message: `${error.message}`,
    };
  }
};

module.exports = {
  create,
  getAll,
  get,
  update,
  getOrderByObjectId
};
