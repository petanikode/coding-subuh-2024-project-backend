var express = require('express');
var router = express.Router();

const { User } = require("../model");
const authToken = require('../middleware/authToken');

router.get('/', authToken, async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: ['name', 'email', 'phoneNumber', 'role']
    });

    if (!user) {
        return res.status(404).json({
            error: true,
            message: "User Not found"
        })
    }

    res.status(200).json(user);
})

module.exports = router;