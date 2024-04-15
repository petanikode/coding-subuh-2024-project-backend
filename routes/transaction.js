var express = require("express");
var router = express.Router();

const { Transaction } = require("../db/model");
const authToken = require("../middleware/authToken");

router.get("/", authToken, async (req, res) => {
  const transactions = await Transaction.findAll({
    where: {
      userId: req.user.id,
    },
  });

  res.status(200).json(transactions);
});

module.exports = router;
