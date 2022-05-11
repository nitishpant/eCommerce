const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const order = require("./routes/orderRoute");
const errorMiddleware = require("./middleware/error");

app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);
// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
