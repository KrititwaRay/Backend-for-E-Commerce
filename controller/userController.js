const User=require('../model/userSchema');
const ErrorHandler=require('../utilities/errorHandler');
const asyncErrorHandler=require('../middleware/asyncErrorHandler');

const jwtTokenAndCookie=require('../utilities/jwtTokenAndCookie');

const sendMail=require('../utilities/sendEmail');
const crypto=require('crypto');

//POST: create user
module.exports.signUp=asyncErrorHandler(async(req,res,next)=>{

    const user=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        avatar:{
            public_id:"ddd",
            url:"jjj"

        },
        role:req.body.role
    })
    // const token=user.generateJwtToken();
    // return res.status(201).json({success:true,token,user})
    jwtTokenAndCookie(user,201,res);
})


//POST: login user
module.exports.logIn=asyncErrorHandler(async(req,res,next)=>{
     
    const user=await User.findOne({email:req.body.email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Username or Password",401))
    }

    const isPasswordValid=await user.isPasswordValid(req.body.password);
    if(!isPasswordValid){
        return next(new ErrorHandler("Invalid Username or Password",401))
    }
 
    // const token=user.generateJwtToken();
    // return res.status(200).json({success:true,token,user})
    jwtTokenAndCookie(user,200,res);
})


//GET: log out
module.exports.signOut=asyncErrorHandler(async(req,res,next)=>{

   res.cookie("token",null,{ expires:new Date(Date.now()), httpOnly:true});
    res.status(200).json({success:true,message:"Logged Out"})
})


//POST:  forgot password
module.exports.forgotPassword=asyncErrorHandler(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler("User Not Found",404) );
    }

    const resetToken= user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});


    const resetPasswordUrl=`${req.protocol}://${req.get("host")}/api/v1/users/password/reset/${resetToken}`;
    const message=`Your password reset token is :- \n\n ${resetPasswordUrl} \n\n else You can ignore it`;

    try {
        await sendMail({
         email:user.email,
         subject:"PASSWORD RECOVERY",
         message
        })
        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`
        })
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        console.log(error)
        return next(new ErrorHandler(error.message,500))

        

    }

})

//POST: reset password
module.exports.resetPassword=asyncErrorHandler(async(req,res,next)=>{

    
   
         //creating token hash
    const resetPasswordToken=crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user=await User.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire:{ $gt:Date.now()},
    })
    if(!user){
        return next(new ErrorHandler("Reset password Token is Invalid or has been expired ",400) );
    }

    if(req.body.password !==req.body.confirmpassword){
        return next(new ErrorHandler("Password doesn't matched",400) );
    }
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    jwtTokenAndCookie(user,200,res);
   

})


//GET: get user details
//for self
module.exports.getUserDetails=asyncErrorHandler(async(req,res,next)=>{

    const user=await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user
    })
})

//PUT: update password
module.exports.updatePassword=asyncErrorHandler(async(req,res,next)=>{

    const user=await User.findById(req.user.id).select("+password");

    const isPasswordMatched=await user.isPasswordValid(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.newPassword !== req.body.confirmpassword){
        return next(new ErrorHandler("Password doesn't match",400));
    }

    user.password=req.body.newPassword;

    await user.save();
    jwtTokenAndCookie(user,200,res);

})


//PUT: update profile
module.exports.updateProfile=asyncErrorHandler(async(req,res,next)=>{



     const user=await User.findByIdAndUpdate(req.user.id,{
        $set:{
            name:req.body.name,
            email:req.body.email
        }},
        {
            new:true,
            runValidators:true,
            useFindAndModify:false
        }
     )
    
    
    return res.status(200).json({
        success:true,
        user
    })

})

//GET: get all users
//for admin
module.exports.getAllUsers=asyncErrorHandler(async(req,res,next)=>{
    const users=await User.find({});
    res.status(200).json({
        success:true,
        users
    })
})

//GET: get single user
//for admin
module.exports.get_a_User=asyncErrorHandler(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user
    })
})



//PUT: update users role by admin
//for admin
module.exports.update_user_role_by_admin=asyncErrorHandler(async(req,res,next)=>{



    const user=await User.findByIdAndUpdate(req.params.id,{
       $set:{
        //    name:req.body.name,
        //    email:req.body.email,
           role:req.body.role
       }},
       {
           new:true,
           runValidators:true,
           useFindAndModify:false
       }
    )
   
   
   return res.status(200).json({
    success:true
   })

})


//DELETE: delete user
//for admin
module.exports.deleteUser=asyncErrorHandler(async(req,res,next)=>{
    // const user=await User.findByIdAndDelete(req.params.id);
    const user=await User.findOneAndDelete({_id:req.params.id});

    if(!user){
        return next(new ErrorHandler(`User doesn't exist with id ${req.params.id}`))
    }

    //we will remove cloudinary later
   
   
   return res.status(200).json({
    success:true,
    message:"User has been Deleted"
   })

})

