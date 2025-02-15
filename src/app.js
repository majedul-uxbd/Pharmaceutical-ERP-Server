require("dotenv").config({
  path: `${__dirname}/../.env`
});

//import module
const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");

// Common Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// app.get("/status", (req, res) => {
//   res.json({
//     success: true,
//     time: new Date().getTime(),
//   });
// });

// Define your static file paths
const staticFilePath = path.join(__dirname, "/../uploads");
app.use("/uploads", express.static(staticFilePath));

const APP_PORT = process.env.APP_PORT;
app.listen(APP_PORT, () => {
  console.log(`The app is listening at http://localhost:${APP_PORT}`);
});
