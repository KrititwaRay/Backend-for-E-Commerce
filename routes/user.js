const router=require('express').Router();

const userController=require('../controller/userController');

const {isAuthenticated,isAdminOrNot}=require('../middleware/authentication');

router.post('/sign-up',userController.signUp); //sign up


router.post('/sign-in',userController.logIn); //sign in


router.get('/sign-out',userController.signOut); //sign out

router.post('/password/forgot',userController.forgotPassword); //forgot password

router.put('/password/reset/:token',userController.resetPassword);//reset password


router.get('/me',isAuthenticated,userController.getUserDetails);//get user details  //for self


router.put('/password/update',isAuthenticated,userController.updatePassword);//update password

router.put('/me/update',isAuthenticated,userController.updateProfile);//update profile


router.get('/all-users',isAuthenticated,isAdminOrNot("Admin"),userController.getAllUsers);//get all users //for admin


router.get('/:id',isAuthenticated,isAdminOrNot("Admin"),userController.get_a_User);//get a user //for admin

router.put('/role/:id',isAuthenticated,isAdminOrNot("Admin"),userController.update_user_role_by_admin); //update users role by admin //for admin

router.delete('/delete/:id',isAuthenticated,isAdminOrNot("Admin"),userController.deleteUser); //delete user //for admin

module.exports=router;