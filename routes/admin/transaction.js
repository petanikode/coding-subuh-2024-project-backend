var express = require("express");
var router = express.Router();

const { Transaction, User } = require("../../db/model");
const authToken = require("../../middleware/authToken");

router.get("/", authToken, async (req, res) => {
  let transactions;

  if (req.query.status) {
    transactions = await Transaction.findAll({
      where: {
        status: req.query.status,
      },
      include: User,
    });
  } else {
    transactions = await Transaction.findAll({
      include: User,
    });
  }

  res.status(200).json(transactions);
});

module.exports = router;
