const jwt = require('jsonwebtoken');
const skipLinks = ['/signup', '/signin'];

const isAuthorized = (req, res, next) => {
    if(skipLinks.map(link => new RegExp(link)).some(link => req.url.match(link))) return next();
    if(!Object.keys(req.headers).includes("authorization")) {
        throw new Error("You need to be logged in");
    }
    const token = jwt.decode(req.headers.authorization.split("Bearer ")[1]);
    req.user = token;
    next();
}

const dontSkipLinks = ['/makeAdmin/\d+', '/removeAdmin/\d+']
const isAdmin = (req, res, next) => {
    if(!dontSkipLinks.map(link => new RegExp(link)).some(link => req.url.match(link))) return next();
    if(req.user.admin === 0) {
        throw new Error("You must be an admin");
    }
    next();
}

module.exports = {
    isAuthorized,
    isAdmin
};