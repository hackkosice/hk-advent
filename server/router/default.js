const { isAuthorized } = require('../middleware/authorized');
const express = require('express');
const errorHandler = require('../middleware/error');
const router = express.Router();
const { generateToken, validateToken } = require('../utils/utils');

router.use(express.json());
router.use(isAuthorized);

router.get('/', (req, res) => {
    res.json({status: 'ok'});
});

router.post('/signup', (req, res) => {
    // console.log(req.body.password);
    const token = generateToken(req.body.email);
    res.json({status: 'ok', token});
});

router.post('/signin', (req, res) => {
    try {
        const decoded = validateToken(req.headers.authorization.split('Bearer ')[1]);
        console.log(decoded);
        res.json({status: 'ok'});
    } catch (e) {
        throw e;
    }
})
router.use(errorHandler);

module.exports = router;