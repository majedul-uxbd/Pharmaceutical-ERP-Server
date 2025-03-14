require("dotenv").config({
  path: `${__dirname}/../.env`
});

//import module
const express = require("express");
const app = express();
const cors = require('cors');
const path = require("path");

const { authRoute } = require("./router/auth/auth.route");
const { commonRoute } = require("./router/common/common.route");
const { departmentRoute } = require("./router/department/department.route");
const { designationRoute } = require("./router/designation/designation.route");
const { zoneRoute } = require("./router/zone/zone.route");
const { regionRoute } = require("./router/region/region.route");
const { marketRoute } = require("./router/market/market.route");
const { idCountRoute } = require("./router/id-count/id-count.route");
const { employeeRoute } = require("./router/employees/employees.route");

// Common Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Middleware
app.use("/auth", authRoute);
app.use("/common", commonRoute);
app.use("/department", departmentRoute);
app.use("/designation", designationRoute);
app.use("/zone", zoneRoute);
app.use("/region", regionRoute);
app.use("/market", marketRoute);
app.use("/id-count", idCountRoute);
app.use("/employees", employeeRoute);

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
