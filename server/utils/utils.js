const jwt = require('jsonwebtoken');

const generateToken = (email) => {
    const token = jwt.sign({
        email,
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