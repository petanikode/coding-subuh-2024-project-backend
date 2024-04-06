function onlyAdmin(req, res, next) {
    if(req.user.role !== "admin"){
        return res.status(403).json({
            message: "Anda tidak diizinkan"
        })
    }

    next()
}

module.exports = onlyAdmin;