const express = require("express");
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const authRoutes = require("./backend/routes/auth.routes");
const profileRoutes = require('./backend/routes/profile.routes');
const stripeRoutes = require('./backend/routes/stripe.routes');
const authenticateToken = require('./backend/middlewares/auth.middleware')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV;



//routes
app.get("/", async (req, res) => {
  res
    .status(200)
    .send({
      message: "Hello there, this is a Node js Trip Sync API.",
      author: "Syed Mubashir Ali",
      server_alive: true,
      users: users
    });
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', authenticateToken ,profileRoutes);
app.use('/' ,stripeRoutes);

app.listen(PORT, '0.0.0.0',() => {
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
