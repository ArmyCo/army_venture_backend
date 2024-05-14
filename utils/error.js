const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  };

const catchAsync = (func) => {
    return (req, res, next) => {
      func(req,res).catch((error) => next(error));
    };
};
  
module.exports = { 
  globalErrorHandler,
  catchAsync
};