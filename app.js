const express = require("express");
require("dotenv").config();
const authRoutes = require("./backend/routes/auth.routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";


//routes
app.get("/", (req, res) => {
  res
    .status(200)
    .send({
      message: "Hello there, this is a Node js Trip Sync API.",
      author: "Syed Mubashir Ali",
      server_alive: true,
    });
});

app.use('/api/v1/auth', authRoutes);




app.listen(PORT, () => {
  console.log(`=====================================`);
  console.log(`Launching Trip Sync backend Application`);
  console.log(
    `🚀 Application listening on Port ${PORT} on the ${ENV} Environment`
  );
  console.log(
    `Date: ${new Date(Date.now()).toLocaleDateString()} Time: ${new Date(
      Date.now()
    ).toLocaleTimeString()}`
  );
  console.log(`=====================================`);
});
