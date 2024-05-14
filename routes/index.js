const express = require('express');
const router = express.Router();
const placeRouter = require('./placeRouter');

router.get('/', (req, res) => {
    res.send('Hello World!');});

router.use('/places', placeRouter.router);
router.use('/users', require('./userRoutes'));
  
module.exports = router;
