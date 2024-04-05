var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const { comparePassword } = require('../utils/password');

const { User } = require('../db/model');

router.post('/', async function async(req, res) {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.sendStatus(401);
    }

    const user = await User.findOne({
        where: {
            email: email
        }
    })

    if (!user) {
        return res.sendStatus(401);
    }

    const isPasswordCorrect = comparePassword(password, user.password);

    if (!isPasswordCorrect) {
        return res.sendStatus(401);
    }

    const redirectURL = user.role === "admin"
        ? `${req.get('origin')}/admin/index.html`
        : `${req.get('origin')}/index.html`;

    console.log(redirectURL);

    // generate token
    var token = jwt.sign({ id: user.id, role: user.role }, 'RAHASIA_NEGARA');

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({
        message: "Login Berhasil",
        token: token,
        redirectURL,
    })
})


module.exports = router;
