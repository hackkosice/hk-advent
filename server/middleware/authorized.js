const validLinks = ['/signup'];

const isAuthorized = (req, res, next) => {
    if(validLinks.includes(req.url)) return next();
    if(!Object.keys(req.headers).includes("authorization")) {
        throw new Error("You need to be logged in");
    }
    next();
}

module.exports = {
    isAuthorized
};