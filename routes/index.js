const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authenticationRouter = require("./auth.routes.js")
router.use("/auth", authenticationRouter)

module.exports = router;
