// error handler response
exports.errorHandler = (error, req, res, next) => {
  if (error.errors) {
    error.data = { message: error.errors || "error system" };
    return res.status(error.httpStatusCode || 500).json({ data: error.data });
  } else {
    error.error = error.message || "error service";
    return res.status(error.httpStatusCode || 500).json({ data: error });
  }
};

//function to throw error
exports.errorData = (err = "error", httpstatus = 500) => {
  const error = new Error(err);
  error.httpStatusCode = httpstatus;
  return error;
};


