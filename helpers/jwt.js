const jwt = require ('jsonwebtoken');

module.exports = {
    createJWTToken(payload){
        return jwt.sign(payload, "susahditebak", { expiresIn : '24h' })
    }
}