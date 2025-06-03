const express = require("express");
const morgan = require('morgan');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });
const authRoutes = require("./backend/routes/auth.routes");
const profileRoutes = require('./backend/routes/profile.routes');
const stripeRoutes = require('./backend/routes/stripe.routes');
const authenticateToken = require('./backend/middlewares/auth.middleware')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); 
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

app.get("/error-test", (req, res, next) => {
  // Create and throw a custom error
  const err = new Error("Something went wrong!");
  err.status = 400;
  next(err); 
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', authenticateToken ,profileRoutes);
app.use('/' , stripeRoutes);

// ✅ Error-handling middleware
app.use((err, req, res, next) => {
  console.error('🔥 Error:', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Something broke!',
  });
});


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

///uncaugth error handling
process.on('uncaughtException', (err) => {
 console.error('Uncaught Exception:', err);

});

process.on('unhandledRejection', (reason, promise) => {
 console.error('Unhandled Rejection:', reason);

});

