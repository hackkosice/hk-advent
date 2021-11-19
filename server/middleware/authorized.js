const jwt = require('jsonwebtoken');
const validLinks = ['/signup', '/signin', '/', '/users', '/makeAdmin/\d+', '/task/submit'];

const isAuthorized = (req, res, next) => {
    if(validLinks.map(link => new RegExp(link)).some(link => req.url.match(link))) return next();
    if(!Object.keys(req.headers).includes("authorization")) {
        throw new Error("You need to be logged in");
    }
    next();
}

const adminLinks = ['/makeAdmin/\d+', '/removeAdmin/\d+']
const isAdmin = (req, res, next) => {
    if(!adminLinks.map(link => new RegExp(link)).some(link => req.url.match(link))) return next();
    const token = jwt.decode(req.headers.authorization.split("Bearer ")[1]);
    console.log(token);
    next();
}

module.exports = {
    isAuthorized,
    isAdmin
};