export const successResponse = (
  res,
  data,
  message = "Success",
  statusCode = 200
) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

export const errorResponse = (res, error, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: error.message || error,
  });
};

export const validationError = (res, message) => {
  return res.status(400).json({
    success: false,
    error: message,
  });
};

export const notFoundError = (res, message = "Resource not found") => {
  return res.status(404).json({
    success: false,
    error: message,
  });
};

export const unauthorizedError = (res, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    error: message,
  });
};

export const forbiddenError = (res, message = "Access denied") => {
  return res.status(403).json({
    success: false,
    error: message,
  });
};

export const paginatedResponse = (res, data, pagination) => {
  return res.json({
    success: true,
    data,
    pagination,
  });
};
