var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const { comparePassword } = require('../utils/password');

const { User } = require('../model');

router.post('/', async function async (req, res) {
    
    const {email, password} = req.body;
    const user = await User.findOne({
        where: {
            email: email
        }
    })

    if(!user){
        return res.status(401).end();
    }

    const isPasswordValid = comparePassword(password, user.password);

    if(!isPasswordValid){
        return res.status(401).end();
    }

    // generate token
    var token = jwt.sign({ id: user.id, role: user.role }, 'RAHASIA_NEGARA');

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({
        message: "Login Berhasil",
        token: token
    })
})


module.exports = router;
