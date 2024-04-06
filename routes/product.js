var express = require("express");
var router = express.Router();
const { Product } = require("../db/model");

/* GET product listing. */
router.get("/", async function (req, res, next) {
  const products = await Product.findAll();
  res.json(products);
});

module.exports = router;
