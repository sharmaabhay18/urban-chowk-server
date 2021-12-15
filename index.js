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

// app.use(function (_, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://18.118.218.9');

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true);

//   // Pass to next layer of middleware
//   next();
// });


app.use(cors({
  origin: 'http://18.118.218.9'
}));

app.use(express.json());

routeConstructor(app);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
