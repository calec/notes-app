var path = require("path");
var router = require("express").Router();
var apiRoute = require("./api-routes");

router.use("/api", apiRoute);

router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../../client/public/index.html"))
})

module.exports = router;