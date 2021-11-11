const isValidString = (str, name) => {
  if (typeof str !== "string" || str?.trim().length === 0)
    throw {
      status: 400,
      message: `${name} should be of type string and contains valid input`,
    };
};

module.exports = {
  isValidString,
};
