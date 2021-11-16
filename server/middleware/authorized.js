const validLinks = ['/signup', '/signin', '/', '/users', '/makeAdmin/1'];

const isAuthorized = (req, res, next) => {
    // if(validLinks.includes(req.url)) return next();
    // TODO: temporary !!!
    return next();
    if(!Object.keys(req.headers).includes("authorization")) {
        throw new Error("You need to be logged in");
    }
    next();
}

module.exports = {
    isAuthorized
};