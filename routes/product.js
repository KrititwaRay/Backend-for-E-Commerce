const router=require('express').Router();

const productController=require('../controller/productController');

const {isAuthenticated,isAdminOrNot}=require('../middleware/authentication');



router.post('/create-product',isAuthenticated,isAdminOrNot("Admin"),productController.createProduct); //create product  //admin
router.get('/',productController.getAllProducts); //get all products  //user
router.put('/:id',isAuthenticated,isAdminOrNot("Admin"),productController.updateProduct); //update products  //admin
router.delete('/reviews',isAuthenticated,productController.deleteReview); //delete review //user
router.delete('/:id',isAuthenticated,isAdminOrNot("Admin"),productController.deleteProduct); //delete products  //admin
router.get('/reviews',productController.getProductReviews); //get reviews of a product //
router.get('/:id',productController.getProductDetails); //get a product  //user
router.post('/review',isAuthenticated,productController.createProductReview); //create review //user


module.exports=router;