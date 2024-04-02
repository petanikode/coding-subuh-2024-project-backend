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
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if(!isPasswordValid){
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    // generate token
    var token = jwt.sign({ data: user.id, role: user.role }, 'RAHASIA_NEGARA');

    res.status(200).json({
        message: "Login Berhasil",
        token: token
    })
})


module.exports = router;
