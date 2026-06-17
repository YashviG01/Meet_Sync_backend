const routeNotFound = (req, res, next) => {

    const error=new Error(`Not Found - ${req.originalUrl}`)
    error.statusCode = 404;
    next(error);
}
//manually calling the error handler middleware
const errorHandler=(err,req,res,next)=>{
    const statusCode=err.statusCode || 500;

    let message=err.message || "Internal Server Error";
if(err.name ==="castError"){
    message="Resource not found. Invalid: "+err.path;
}
    res.status(statusCode).json({
        success: false,
        error: message
    });
    // export {routeNotFound,errorHandler};
}
 module.exports = {routeNotFound,errorHandler};
