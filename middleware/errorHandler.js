const { ZodError } = require("zod");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  const response = {
    message: err.message || "An unexpected error occurred",
  };

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    statusCode = 400;
    response.message = "Input validation failed";
    // ZodError has 'issues' property, not 'errors'
    response.errors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
  }
  // Handle custom AppErrors
  else if (err.statusCode) {
    statusCode = err.statusCode;
    response.message = err.message;
  }

  // Handle development server errors
  if (process.env.NODE_ENV === "development" && statusCode >= 500) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
