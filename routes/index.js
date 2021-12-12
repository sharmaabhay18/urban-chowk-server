const userRoutes = require("./users");
const testimonialRoutes = require("./testimonial");
const customerAddRoutes = require("./customerAddress");
const couponsCodeRoutes = require("./couponsCode");
const categoryRoutes = require("./category");
const itemsRoutes = require("./items");
const orderRoutes = require("./order");

const routeConstructor = (app) => {
  app.use("/user", userRoutes);
  app.use("/testimonial", testimonialRoutes);
  app.use("/customerAddress", customerAddRoutes);
  app.use("/coupon", couponsCodeRoutes);
  app.use("/category", categoryRoutes);
  app.use("/item", itemsRoutes);
  app.use("/order", orderRoutes);

  app.use("/ping", (_, res) => res.status(200).json({ message: "pong" }));
  //For routes which does not exists
  app.use("*", (_, res) =>
    res.status(404).json({ message: "Resource not found" })
  );
};

module.exports = routeConstructor;
