const userRoutes = require("./users");
const testimonialRoutes = require("./testimonial");

const routeConstructor = (app) => {
  app.use("/user", userRoutes);
  app.use("/testimonial", testimonialRoutes);

  app.use("/ping", (_, res) => res.status(200).json({ message: "pong" }));
  //For routes which does not exists
  app.use("*", (_, res) =>
    res.status(404).json({ message: "Resource not found" })
  );
};

module.exports = routeConstructor;
