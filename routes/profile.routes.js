const express = require("express");
const router = express.Router();

const isLoggedIn = require("../middlewares/auth.middlewares.js");

router.get("/private", isLoggedIn, (req, res, next) => {
  //console.log("Llamada de: ", req.session.user);
  res.render("authentication/smain.hbs");
});

router.get("/private", isLoggedIn, (req, res, next) => {
    //console.log("Llamada de: ", req.session.user);
    res.render("authentication/private.hbs");
  });
module.exports = router;
