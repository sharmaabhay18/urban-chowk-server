const { ObjectId } = require("mongodb");

const isValidString = (str, name) => {
  if (typeof str !== "string" || str?.trim().length === 0)
    throw {
      status: 400,
      message: `${name} should be of type string and contains valid input`,
    };
};

const throw400Error = (key, res) =>
  res.status(400).json({ message: `${key}` });

const isAdmin = (role) => {
  if (role !== "admin") {
    throw {
      status: 401,
      message: "You are not authorized to do changes",
    };
  }
};

const handleCatchError = (error, res) => {
  const statusCode = error?.status || 500;
  const errorMessage = error?.message || "Something went wrong!";

  return res.status(statusCode).json({ sucess: false, message: errorMessage });
};

const validateObjectId = (id) => {
  if (!id) throw "Id is required";
  if (typeof id !== "string" || id?.trim()?.length === 0) {
    throw {
      status: 400,
      message: "Please enter a valid id",
    };
  }

  const parsedId = ObjectId.isValid(id);

  if (!parsedId) {
    throw {
      status: 400,
      message: "Id passed is not a valid object id",
    };
  }
};

module.exports = {
  isValidString,
  throw400Error,
  isAdmin,
  handleCatchError,
  validateObjectId,
};
