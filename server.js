const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const connectDB = require("./db.js");
const userRoutes = require("./routes/user.routes");
const developerProfileRoutes = require("./routes/developerProfile.routes.js")
const stageHistoryRoutes = require("./routes/stageHistory.routes.js");

require("dotenv").config();

app.use(cors());
app.use(express.json());



app.use(userRoutes);
app.use(developerProfileRoutes);
app.use(stageHistoryRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
connectDB();
