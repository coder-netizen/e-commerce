const wishlistSchema = require('../models/wishlistSchema.js');


const productSchema = require('../models/productSchema.js');
const userSchema = require('../models/userSchema');
const jsonwebtoken = require('../middlewares/jsonwebtoken.js');


// add product to wishlist
 const addtowishlist = async (req,res) => {
    try {
        const userId = req.user.id
        // const {userId,productId} = req.body;
        // const {productId} = req.body;
        const productId = req.params.productId
         
    // check if the wishlist exists for the user
    let wishlist = await wishlistSchema.findOne({userId});

    if(!wishlist){
        // create a new wishlist
        wishlist = await wishlistSchema({ userId, products: [productId]});
    } else {
        // add the product if it doesnot exist
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
        } else {
            return res.status(400).json({ message: "Product already in wishlist" });
        }
    }
    await wishlist.save();
    res.status(200).json({message:"product added to wishlist"});





    } catch (error) {
        console.log(error);
        
        res.status(500).json({message:"error adding to wishlist"})
    }
 }
   const removefromwishlist = async (req,res) => {
    try {
          const userId = req.user.id;
          const productId = req.params.id;
          //find the wishlist for the user
          const wishlist = await wishlistSchema.findOne({userId});
        if (wishlist){
            wishlist.products = wishlist.products.filter((product) => product.toString() !== productId );
        }
        await wishlist.save();
        return res.status(200).json({ message: "Product removed from wishlist" });

            res.status(404).json({message:"wishlist not found"});
    } catch (error) {
        res.status(500).json({message:"error removing from wishlist"});
    }
   };

   const getwishlist = async (req,res) => {
    try {
          const userId =  req.userId;
          // fetch the wishlist
          const wishlist = await wishlistSchema.findOne({userId}).populate('products');
          if(!wishlist){
            return res.status(400).json({message:"wishlist is empty"});
          }
          res.status(200).json({message:"wishlist received sucessfully",wishlist:wishlist.products});



    } catch (error) {
        console.error("error in retrieving wishlist");
        res.status(500).json({message:"server error"});
    }
   }





 module.exports = {addtowishlist,removefromwishlist,getwishlist};


