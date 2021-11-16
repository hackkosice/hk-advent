const errorHandler = (err, req, res, next) => {
    res.status(400).send({status: 'error', payload: err.message});
}

module.exports = errorHandler;