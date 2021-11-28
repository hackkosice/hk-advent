const jwt = require('jsonwebtoken');

const generateToken = (username, isAdmin) => {
    const token = jwt.sign({
        username,
        isAdmin: isAdmin > 0
    }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
    return token;
}

const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (e) {
        throw e;
    }
}

module.exports = {
    generateToken,
    validateToken
}