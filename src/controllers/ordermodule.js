const orderSchema = require('../models/orderSchema');
const productSchema = require('../models/productSchema');
const userSchema = require('../models/userSchema');
const verifyToken = require('../middlewares/jsonwebtoken');
 
const placeorder = async (req,res) => {
    try {  
        const userId = req.user.id;
        const{items,totalamount,address,paymentmethod} = req.body;
   
      //check if there is enough stock
      for(let item of items){
        const product = await productSchema.findById(item.productId);

        if(product.stock<item.quantity){
            return res.status(400).json({message:"out of stock"});
        }
      } 
      const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);
    
      // create order document
      const neworder = new orderSchema({
        user:userId,
        items:items,
        totalamount:totalamount,
        address:address,
        paymentMethod:paymentmethod,
        status:'pending'
      });
      await neworder.save();
      return res.status(201).json({
        message: "Order placed successfully",
        order: neworder,
      });
      // update product stock
      for(let item of items ) {
        await productSchema.findByIdAndUpdate(item.productId,{
          $inc:{stock:-item.quantity}
        })
      }

 
        
    } catch (error) {
        console.error("error placing in order:",error);
        return res.status(500).json({message:"server error"});
    }
}

module.exports = {placeorder};