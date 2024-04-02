var express = require('express');
var router = express.Router();

const { hashPassword } = require('../utils/password');

const { User } = require('../model');

router.post('/', async function async(req, res) {

    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password: await hashPassword(password)
    });

    if(!user) {
        res.json({
            error: true,
            message: "Ups gagal mendaftar, silahkan coba lagi!"
        })
    }
    
    res.status(201).json({
        error: false,
        message: "Registrasi berhasil!",
        data: user
    });
})


module.exports = router;
