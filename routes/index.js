const express = require('express');
const router = express.Router();
const placeRouter = require('./placeRouter');

router.get('/', (req, res) => {
    res.send('Hello World!');});

router.use('/places', placeRouter.router);
  
module.exports = router;
