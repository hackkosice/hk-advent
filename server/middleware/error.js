const errorHandler = (err, req, res, next) => {
    console.error(`[ERR] - ${err.message}`);
    res.status(400).send({status: 'error', payload: err.message});
}

module.exports = errorHandler;