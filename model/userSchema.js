const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide Name"],
        maxLength:[20,"Name should not cress 20 characters"]
    },
    email:{
        type:String,
        required:[true,"Please provide Email"],
        unique:true,
        validator:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Provide Password"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        enum:["Admin","User"],
        default:"User",
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    }
},{timestamps:true  })



userSchema.pre('save',async function (next){
    if(!this.isModified("password")){
       next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
})


userSchema.methods.generateJwtToken=function(){

    return jwt.sign({
        id:this._id
    }, process.env.JWT_SECRET_KEY,{ expiresIn:'10d'})
}

userSchema.methods.isPasswordValid=async function(password){
  return  await bcrypt.compare(password,this.password);
}

userSchema.methods.getResetPasswordToken=function(){
 
    //hgenerate token
    const resetToken=crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire=Date.now()+15*60*1000;
    return resetToken;
      

}



const User=mongoose.model('User',userSchema);

module.exports=User;