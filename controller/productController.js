const Product=require('../model/productSchema');
const User=require('../model/userSchema');
const ErrorHandler=require('../utilities/errorHandler');
const asyncErrorHandler=require('../middleware/asyncErrorHandler');

const ApiFeatures=require('../utilities/apifeatures');

//POST: create product
//admin
module.exports.createProduct=asyncErrorHandler(async(req,res,next)=>{
  req.body.user=req.user.id;
  
    const product=await Product.create(req.body);
    return res.status(201).json({
      success:true,
      product
    });
})


//GET: get all products
//user
module.exports.getAllProducts=asyncErrorHandler(async(req,res)=>{
     const resultPerPage=5;
     const countProduct=await Product.countDocuments();
     const apiFeature=new ApiFeatures(Product.find(),req.query).search().filter().pagination(resultPerPage);
     const products=await apiFeature.query;
     return res.status(200).json({
      success:true,
      products,
      countProduct
    });
})


//PUT: update product
//admin
module.exports.updateProduct=asyncErrorHandler(async(req,res,next)=>{

    let product=await Product.findById(req.params.id);
    if(!product){
      return next( new ErrorHandler("Product Not Found",404) );
    }
    
     product=await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{ new:true , runValidators:true ,useFindAndModify:false });

     return res.status(200).json({success:true,product});
})


//DELETE: delete a product
//admin
module.exports.deleteProduct=asyncErrorHandler(async(req,res,next)=>{
    let product=await Product.findById(req.params.id);
    if(!product){
      return next( new ErrorHandler("Product Not Found",404) );
    }
    product=await Product.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({success:true,message:"Product has benn Deleted"});
}
)

//GET: get product details
//user
module.exports.getProductDetails =asyncErrorHandler(async (req, res, next) => {
    

    let product = await Product.findById(req.params.id);
   
    if(!product){
      return next( new ErrorHandler("Product Not Found",404) );
    }
    
    return res.status(200).json({ success: true, product });
});


//POST: create review or uodate review
module.exports.createProductReview=asyncErrorHandler(async (req, res, next) => {
  //  console.log(req.body)
    const {rating,comment,productId}=req.body;

    const review={
      user:req.user._id,
      name:req.user.name,
      rating:Number(rating),
      comment
    }
 

    const product=await Product.findById(productId);
       
    const isReviewed=product.reviews.find(rev=>rev.user.toString()===req.user._id.toString());


    if(isReviewed){
       product.reviews.forEach((rev)=>{
        if(rev.user.toString()===req.user._id.toString()){
          rev.rating=rating,
          rev.comment=comment
        }
       })
    }else{
      product.reviews.push(review);
      product.numOfReviews=product.reviews.length;

    }
    

    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;
  
   

    await product.save({validateBeforeSave:true });
    res.status(200).json({
      success:true
    })

})



//GET: get all reviews of a product
//
module.exports.getProductReviews=asyncErrorHandler(async(req,res,next)=>{
  
  const product=await Product.findById(req.query.id);
 
  if(!product){
    return next(new ErrorHandler("Product not found",404));
  }
  return res.status(200).json({
   success:true,
  reviews:product.reviews,
 });
})


//DELETE: delete review
//
module.exports.deleteReview = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  console.log(product);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString());
  console.log(reviews);

  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  const numOfReviews = reviews.length;

  let ratings = 0;
  if (numOfReviews > 0) {
    ratings = avg / numOfReviews;
  }

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  return res.status(200).json({
    success: true,
  });
});