var express = require('express');
var router = express.Router();

const { Cart } = require("../model");
const authToken = require('../middleware/authToken');

router.get('/count', authToken, async (req, res) => {
    const cartCount = await Cart.count({
        where: {
            userId: req.user.id
        }
    })
    
    res.status(200).json(cartCount ?? 0);
})

module.exports = router;