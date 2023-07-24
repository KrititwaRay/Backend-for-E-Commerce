# BACKEND FOR E-COMMERCE


## DESCRIPTION
  This Node.js E-Commerce Backend is a feature-rich backend system designed to support an online E-Commerce platform. It provides functionalities for user authentication, user and admin profile management, product management, product reviews, and order management. Users can sign up, sign in, and update their profile information. Admins have additional privileges to manage users, products, and orders. The backend ensures a secure and personalized experience for users based on their roles. Overall, it offers a seamless and efficient solution for running an E-Commerce platform.

## TECH STACK
 

## npm packages
   1. express
   2. mongoose
   3. dotenv
   4. cookie-parser
   5. bcrypt
   6. jsonwebtoken
   7. nodemailer
   8. validator
   

## HOW TO SETUP THE PROJECT ON LOCAL SYSTEM
  1. Clone this project
  2. Start by installing npm if you do not have it already 
  3. Navigate to Project Directory
 After reaching the Project directory you have to run the following command
    
    npm install , node index.js or nodemon index.js


## FEATURES


# User
   1. User Authentication:- Users can sign up, sign in, and sign out as either an Admin or a normal user, ensuring a personalized experience based on their roles.

   2. Password Management:- Users can change their passwords either by using the "Forgot Password" feature, which sends a PASSWORD RECOVERY mail, or by updating the password manually.

   3. User Profile:- Users can view and update their own details, maintaining their profile information.

   4. Admin User Management:- The Admin has the authority to view all users or access details of a single user. Additionally, they can promote another user to an Admin role or delete a user.

# Product
   1. Product Creation:- Admins can create new products and add them to the E-Commerce platform.

   2. Product Listings:- Users can view all available products listed on the platform.

   3. Product Updates and Deletion:- Admins can update product information or remove products from the platform.

   4. Product Details:- Users can access detailed information about a specific product, helping them make informed decisions.

   5. Product Reviews:- Users can provide product reviews and also update their reviews if needed.

   6. Review Management:- Users can see all reviews for a product and have the ability to delete their own reviews.

# Order
   1. Order Placement:- Users can create orders for products they wish to purchase.

   2. Order Tracking:- Users can view their order history and see details of a single order they placed.

   3. Admin Order Management:- Admins have access to view all orders, update their statuses, and even delete orders if necessary.