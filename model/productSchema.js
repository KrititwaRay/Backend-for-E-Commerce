const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
     name:{
        type:String,
        required:[true,"Please enter product Name"],
        trim:true
     },
     description:{
        type:String,
        required:[true,"Please enter product Description"]
     },
     price:{
        type:Number,
        required:[true,"Please enter product Price"],
        maxLength:[8,"Price can't exceed 8 characters"]
     },
     ratings:{
        type:Number,
        default:0
     },
     images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
     ],
     category:{
        type:String,
        required:[true,"Please enter product Category"],

     },
     stock:{
        type:Number,
        required:[true,"Please enter product Stock"],
        maxLength:[4,"Stock can't exceed 4 characters"],
        default:1
     },
     numOfReviews:{
        type:Number,
        default:0
     },
     reviews:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
         },
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
        }
     }],
     user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true
     },
     createdAt:{
        type:Date,
        default:Date.now
     }
} )

const Product=mongoose.model("Product",productSchema);

module.exports=Product;