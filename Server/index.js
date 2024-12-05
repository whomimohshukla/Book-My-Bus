const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;
const connnectDb = require("./config/db");
const userRoutes = require("./routes/user.Auth.routes/user.Auth.route");
const busRoutes = require("./routes/Bus.Maker.Routes/Bus.Routers");
const cityMakeRoute = require("./routes/City.Maker.Routes/cityMake");
const scheduleRoutes = require("./routes/Schedule.Routes/schedule.routes");
const operatorRoute = require("./routes/Operator.Routes/operator.Routes");
const busTravelRoute = require("./routes/BusTravelRoute.routes/busTravel.Routes");
const searchBusesRoute = require("./routes/SearchBuses.Routes/searchBuses.routes");
const contactRoute = require("./routes/contact.routes/contact.Routes");
const emergencyRoute = require("./routes/EmergencyServices.routes/emergencyServices.Routes");

const cors = require("cors");
// connect to MongoDB
connnectDb();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes activation
app.use("/api/user", userRoutes);
app.use("/api/city", cityMakeRoute);
app.use("/api/busRoute", busRoutes);
app.use("/api/scheduleRoutes", scheduleRoutes);
app.use("/api/operatorRoute", operatorRoute);
app.use("/api/busTravelRoute", busTravelRoute);
app.use("/api/searchBuses", searchBusesRoute);
app.use("/api/contact", contactRoute);
app.use("/api/emergency", emergencyRoute);

//testing the google PI

// port activation
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) =>
  res.send("Hello World! This is the BookMyBus Server.")
);
