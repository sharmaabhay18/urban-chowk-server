const express = require("express");
const app = express();
const cors = require('cors')
const routeConstructor = require("./routes");
require("dotenv").config();

app.use(cors())
app.use(express.json());

routeConstructor(app);

app.listen(8080, () => console.log("Server started at port 8080"));
