const asyncErrorHandler=require('./asyncErrorHandler');
const ErrorHandler=require('../utilities/errorHandler');
const jwt=require('jsonwebtoken');
const User=require('../model/userSchema');

   

const isAuthenticated = asyncErrorHandler(async (req, res, next) => {
    const token = req.cookies.token;


    if (!token) {
        return next(new ErrorHandler("Please Log In", 401));
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // console.log(decodeData.id);

    try {
        req.user = await User.findById(decodeData.id);
        // console.log(req.user);
        next();
    } catch (error) {
        console.log(error);
        return next(new ErrorHandler("User not found", 401));
    }
});



const isAdminOrNot = (...roles) => {
    return (req,res,next)=>{
        // console.log(roles)
        
        if(!roles.includes(req.user.role)){
        
            return next(new ErrorHandler("You are not allowed to access,only Admin can ",403))   
        }
    
        next();
    }
};

module.exports = {
    isAuthenticated,
    isAdminOrNot
}

