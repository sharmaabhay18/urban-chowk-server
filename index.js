const express = require("express");
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");

const routeConstructor = require("./routes");
const cred = require("./config/urban-chowk-firebase.json");

require("dotenv").config();

admin.initializeApp({
  credential: admin.credential.cert(cred),
});

app.use(cors());
app.use(express.json());

routeConstructor(app);

app.listen(8080, () => console.log("Server started at port 8080"));
