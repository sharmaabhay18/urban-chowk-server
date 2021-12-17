const express = require("express");
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");

const routeConstructor = require("./routes");
const cred = require("./config/urban-chowk-firebase");

require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(cred?.firebase),
});

app.use(cors({
  origin: "https://urban-chowk-fe.herokuapp.com"
}));

app.use(express.json());

routeConstructor(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
