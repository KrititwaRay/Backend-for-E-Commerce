const express=require('express');
const mongoose=require('./config/mongoose');
const app=express();
require('dotenv').config();
const port=process.env.PORT||3000;
const cookieParser=require('cookie-parser');
const errorMiddleware=require('./middleware/error');  //error



app.use(express.json());
app.use(cookieParser());


//import routes
const userRoute=require('./routes/user');
const productRoute=require('./routes/product');
const orderRoute=require('./routes/order');


app.use('/api/v1/users',userRoute);
app.use('/api/v1/products',productRoute);
app.use('/api/v1/orders',orderRoute);


app.use(errorMiddleware);



app.listen(port,()=>{console.log(`Server is running on port ${port}`)})
