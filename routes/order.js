const router=require('express').Router();

const orderController=require('../controller/orderController');

const {isAuthenticated,isAdminOrNot}=require('../middleware/authentication');

/* POST */
router.post('/new',isAuthenticated,orderController.newOrder); //create order  // authenticated user

/* GET  */ 
router.get('/me',isAuthenticated,orderController.myOrders); //my orders  // authenticated user

router.get('/:id',isAuthenticated,orderController.getSingleOrder); // get a single order of a user   //admin

router.get('/admin/all',isAuthenticated,isAdminOrNot("Admin"),orderController.getAllOrders);  //get all orders    //admin 


/* PUT */
router.put('/:id/admin/status',isAuthenticated,isAdminOrNot("Admin"),orderController.updateOrderStatus);  //update order status   //admin 

/* Delete */
router.delete('/:id',isAuthenticated,isAdminOrNot("Admin"),orderController.deleteOrder);  //delete order    //admin 

module.exports=router;