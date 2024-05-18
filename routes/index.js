const express = require('express');
const router = express.Router();
const userRouter = require('./userRouter');
const placeRouter = require('./placeRouter');
const eventRouter = require('./eventRouter');
const courseRouter = require('./courseRouter');

router.get('/', (req, res) => {
    res.send('Hello World!');
  });
router.use('/users', userRouter.router);
router.use('/places', placeRouter.router);
router.use('/events', eventRouter.router);
router.use('/courses', courseRouter.router);
  
module.exports = router;
