const express = require("express");

const stripeController = require("../controllers/stripe.controller");

const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.get("/cart", (req, res) => {
  res.render("checkout.ejs");
});

router.post("/checkout", stripeController.checkout);

router.get("/cancel", (req, res) => {
  res.redirect("/cart");
});

router.get("/complete", stripeController.complete);

module.exports = router;
