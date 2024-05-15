const express = require('express');
const router = express.Router();
const placeRouter = require('./placeRouter');
const eventRouter = require('./eventRouter');

router.get('/', (req, res) => {
    res.send('Hello World!');
  });
router.use('/places', placeRouter.router);
router.use('/events', eventRouter.router);
  
module.exports = router;
