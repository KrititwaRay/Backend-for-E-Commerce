const jwtTokenAndCookie=(user,statusCode,res)=>{
    const token=user.generateJwtToken();
   
    const options={
       expires:new Date(Date.now()+ 7*24*60*60*1000),
       httpOnly:true
    }
    return res.status(statusCode).cookie("token",token,options).json({success:true,token,user});
}

module.exports=jwtTokenAndCookie;