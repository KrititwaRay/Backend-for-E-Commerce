const ErrorHandler=require('../utilities/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
     
    //Wrong Mongodb Id error

    if(err.name =="CastError"){
      const message=`Resource not found. Invalid ${err.path}`;
      err=new ErrorHandler(message,400);
    }

    //wrong jwt

    if(err.name=="JsonWebTokenError"){
      const message=`JSON Web Token is Invalid,Try again`;
      err=new ErrorHandler(message,400);
    }

    //jwt expire error
    if(err.name=="TokenExpiredError"){
      const message=`JSON Web Token is Expired,Try again`;
      err=new ErrorHandler(message,400);
    }


    res.status(err.statusCode).json({
      success: false,
      message: err.stack,
    });
  };