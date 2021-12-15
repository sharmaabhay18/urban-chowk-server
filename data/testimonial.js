const { ObjectId } = require("mongodb");

const mongoCollections = require("../config/mongoCollections");
const testimonials = mongoCollections.testimonials;
const { isValidString, validateObjectId } = require("../utils/helperFuctions");

const get = async () => {
  try {
    const testimonialsCollection = await testimonials();
    const alltestimonial = await testimonialsCollection.find({}).toArray();

    const payload = alltestimonial.map((t) => {
      return { _id: t?._id?.toString(), ...t };
    });

    return payload;
  } catch (error) {
    throw {
      status: 404,
      message: "Error while getting testimonial details",
    };
  }
};

const create = async (payload) => {
  try {
    const { name, icon, description, image_url } = payload;

    if (!name) throw { status: 400, message: "Name is required parameter" };
    if (!icon) throw { status: 400, message: "Icon is required parameter" };
    if (!description)
      throw { status: 400, message: "Description is required parameter" };
    if (!image_url)
      throw { status: 400, message: "Image Url is required parameter" };

    isValidString(name, "Name");
    isValidString(icon, "Icon");
    isValidString(description, "Description");
    isValidString(image_url, "Image_url");

    const testimonialsCollection = await testimonials();

    const testimonialCreated = await testimonialsCollection.insertOne(payload);
    if (testimonialCreated.insertedCount === 0)
      throw { status: 409, message: "Could not create testimonial" };

    const alltestimonial = await testimonialsCollection.find({}).toArray();

    return {
      isCreated: true,
      testimonials: alltestimonial
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

    const testimonialsCollection = await testimonials();
    const deletionInfo = await testimonialsCollection.deleteOne({
      _id: ObjectId(id),
    });

    if (deletionInfo.deletedCount === 0) {
      throw {
        status: 409,
        message: `Could not delete testimonial with id of ${id}`,
      };
    }

    const alltestimonial = await testimonialsCollection.find({}).toArray();

    return { testimonialId: id, testimonials: alltestimonial, deleted: true };
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
