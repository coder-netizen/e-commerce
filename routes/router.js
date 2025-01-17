

const express = require('express');
const router = express.Router();
const {signup,login,forgotpassword,resetpassword} = require('../src/controllers/authentication');
const {addproduct, allproducts, updateproducts, deleteproducts, productdetails} = require('../src/admincontroller/productmodule.js');
const upload = require('../src/middlewares/multer.js');
const category = require('../src/controllers/categorymodule.js');
const {addtowishlist, removefromwishlist, getwishlist} = require('../src/controllers/wishlistmodule.js');
const jsonwebtoken = require('../src/middlewares/jsonwebtoken.js');
const{addproducttocart, viewCart} = require('../src/controllers/cartmodule.js');
const verifyToken = require('../src/middlewares/jsonwebtoken.js');
const{placeorder, vieworder, cancelorder} = require('../src/controllers/ordermodule.js');
const { verify } = require('crypto');
const { getprofile, updateprofile, updatepassword, deleteaccount } = require('../src/controllers/profilemanagementmodule.js');
const { getproductdetails } = require('../src/controllers/userproductmodule.js');
 //authentication routes
 router.post('/signup',signup)


router.post('/login',login);
router.post('/forgotpassword',forgotpassword);
router.post('/resetpasssword',resetpassword);
//product routes
router.post('/addproduct',upload.single('image'),addproduct);
router.get('/allproducts',allproducts);
router.put('/updateproducts/:id',updateproducts);
router.delete('/deleteproducts/:id',deleteproducts);
router.get('/productdetails',productdetails);
//category routes
router.get('/category',category);
//wishlist routes
router.post('/addtowishlist/:productId',verifyToken,addtowishlist);
router.delete('/removefromwishlist/:productId',verifyToken,removefromwishlist);
router.get('/getwishlist',verifyToken,getwishlist);
//cart routes
router.post('/addproducttocart/:productId',verifyToken,addproducttocart);
router.get('/viewcart',verifyToken,viewCart);
// order routes
router.post('/placeorder',verifyToken,placeorder);
router.get('/vieworder/:orderId',verifyToken,vieworder);
router.put('/cancelorder/:orderId',verifyToken,cancelorder);
// profile management routes
router.get('/getprofile',verifyToken,getprofile);
router.put('/updateprofile',verifyToken,updateprofile);
router.post('/updatepassword',verifyToken,updatepassword);
router.delete('/deleteaccount',verifyToken,deleteaccount);
// product routes user
router.get('/getproductdetails/:productId',verifyToken,getproductdetails);










module.exports = router;