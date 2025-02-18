export const errorHandler = (err, req, res, next) => {
    res.status(+err.cause || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        stack: err.stack || null,
    });
};