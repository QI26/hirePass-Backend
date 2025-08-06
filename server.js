const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();


app.use(cors());

app.use(express.json());


app.listen(4500, () => {
  console.log(`Server is running on http://localhost:${4500}`);
});