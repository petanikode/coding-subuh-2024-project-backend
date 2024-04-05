var express = require('express');
var router = express.Router();

const { hashPassword } = require('../utils/password');

const { User } = require('../db/model');

router.post('/', async (req, res) => {

    const { name, email, password, phoneNumber } = req.body;

    console.log(phoneNumber);
  
    const user = await User.create({
        name,
        phoneNumber,
        email,
        password: hashPassword(password)
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
