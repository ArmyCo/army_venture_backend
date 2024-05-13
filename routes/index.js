const express = require('express');

const placeRouter = require('./placeRouter');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello World!');});

router.use('/places', placeRouter.router);
router.use('/users', require('./userRoutes'));
  
 module.exports = router;
