const express = require('express');
const app = express();
app.use(express.json());
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");
const errorMiddleware = require("./middleware/error");

app.use("/api/v1", product);
app.use("/api/v1", user);
// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
