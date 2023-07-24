const Order=require('../model/orderSchema');
const Product=require('../model/productSchema');
const ErrorHandler=require('../utilities/errorHandler');
const asyncErrorHandler=require('../middleware/asyncErrorHandler');


//POST -/api/v1/orders/new
//Create new order
//  user
module.exports.newOrder=asyncErrorHandler(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxsPrice,
        shippingPrice,
        totalPrice
     }=req.body;

    

     const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxsPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
     })

     return res.status(201).json({
        success:true,
        order
     })
})


//GET -/api/v1/orders/:id
//get single order

module.exports.getSingleOrder=asyncErrorHandler(async(req,res,next)=>{


    const order=await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return  next(new ErrorHandler(`Order not found with this id ${req.params.id}`,404));
    }

    return res.status(200).json({
        success:true,
        order
    })

})



//GET -/api/v1/orders/me
// my order
// authenticated user
module.exports.myOrders=asyncErrorHandler(async(req,res,next)=>{


    const orders=await Order.find({user:req.user._id});

    return res.status(200).json({
        success:true,
        orders
    })

})


//////

//GET -/api/v1/orders/admin/all
// get all orders
//  admin
module.exports.getAllOrders=asyncErrorHandler(async(req,res,next)=>{


    const orders=await Order.find({});

    let totalAmount=0;
    orders.forEach((order)=>{
        totalAmount+=order.totalPrice;
    })

    return res.status(200).json({
        success:true,
        totalAmount,
        orders
    })

})

//PUT -/api/v1/orders/:id/admin/status
// update order status
//  admin
module.exports.updateOrderStatus=asyncErrorHandler(async(req,res,next)=>{


    const order=await Order.findById(req.params.id);
 
    if(!order){
        return  next(new ErrorHandler(`Order not found with this id ${req.params.id}`,404));
    }

   if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler(`You have already delivered this ${req.params.id} order`,400))
   }
   order.orderItems.forEach(async (order)=>{
    await updateStock(order.product,order.quantity)
   })

   order.orderStatus=req.body.status;

   if(req.body.status==="Delivered"){
       order.deliveredAt=Date.now();
   }

  await order.save({validateBeforeSave:false })
    return res.status(200).json({
        success:true,
        
    })

})

async function updateStock(id,quantity){
   const product=await Product.findById(id);
   product.stock=product.stock-quantity;

   await product.save({validateBeforeSave:false});
}



//DELETE -/api/v1/orders
// delete order
// for admin
module.exports.deleteOrder=asyncErrorHandler(async(req,res,next)=>{


    const order=await Order.findById(req.params.id);

    if(!order){
        return  next(new ErrorHandler(`Order not found with this id ${req.params.id}`,404));
    }

    await Order.findByIdAndDelete({_id:order.id});

    return res.status(200).json({
        success:true,
        order:null
    })

})