const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    message: `Not Found - ${req.method} ${req.originalUrl}`,
  });
};

module.exports =  notFoundHandler ;