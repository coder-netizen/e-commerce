const orderSchema = require('../models/orderSchema');
const productSchema = require('../models/productSchema.js');
const userSchema = require('../models/userSchema');
const verifyToken = require('../middlewares/jsonwebtoken');
 
const placeorder = async (req,res) => {
    try {  
        const userId = req.user.id;
        const{items,totalamount,address,paymentMethod} = req.body;
   
      //check if there is enough stock
      for(let item of items){
        const product = await productSchema.findById(item.productId);

        if(product.stock<item.quantity){
            return res.status(400).json({message:"out of stock"});
        }
      } 
      const totalAmount = items.reduce((total, item) => total + item.price * item.quantity);
    
      // create order document
      const neworder = new orderSchema({
        user:userId,
        items:items,
        totalAmount:totalamount,
        address:address,
        paymentMethod:paymentMethod,
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
        console.error("error placing in order:",error.message);
        return res.status(500).json({message:"server error"});
    }
}

   const vieworder = async (req,res) => {
    try {
      const userId = req.user.id;
      const orderId = req.params.id;

       //find userId and orderId from order collection
       const order = orderSchema.findOne({_id:orderId,user:userId}).populate('items.productId');
       //check if there order exists
       if(!order){
        return res.status(404).json({message:"no order found"});

       }
       //sucess response
       return res.status(200).json({message:"order received"});

    } catch (error) {
      console.error("error fetching order",error.message);
      return res.status(500).json({message:"server error"});
    }
   }
   const cancelorder = async (req,res) => {
    try {
      const userId = req.user.id;
      const {cancelReason} = req.body;
      const orderId = req.params.id;
     


//fetch the order
   const order = await orderSchema.findOne({_id:orderId,user:userId});
   if(!order){
    return res.status(404).json({message:"order not found"});
   }
   if (order.orderStatus === "Shipped" || order.orderStatus === "Delivered") {
    // If the order is already shipped or delivered, it cannot be canceled
    return res.status(400).json({
      message: "Order cannot be canceled as it is already shipped or delivered",
    });
  }
   //  cancel the order if status is pending
    order.status =  "cancelled";
    order.isCancelled = true;
    order.cancelReason = cancelReason;
    await order.save();
    return res.status(200).json({message:"order cancelled sucessfully"});


  } catch (error) {
      console.error("error cancelling order",error.message);
      return res.status(500).json({message:"server error"});
    }
   }





module.exports = {placeorder,vieworder,cancelorder};

