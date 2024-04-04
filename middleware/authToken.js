const jwt = require('jsonwebtoken');

function authToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        console.log(token);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
  
    jwt.verify(token, 'RAHASIA_NEGARA', (err, user) => {
        if (err) {
            return res.status(403).json({
                error: true,
                message: "Fobidden, invalid token"
            });
        }
        
        req.user = user;
        next();
    });
}

module.exports = authToken;