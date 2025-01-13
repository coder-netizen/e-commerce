
const productSchema = require('../models/productSchema');
const userSchema = require('../models/userSchema');
const verifyToken = require('../middlewares/jsonwebtoken');

const cartSchema = require('../models/cartSchema');

const addproducttocart = async (req, res) => {
  try {
      const userId = req.user.id;
      const productId = req.params.productId;
      const { quantity } = req.body;

      
      
      if (!quantity || quantity <= 0) {
          return res.status(400).json({ message: "Invalid quantity" });
      }
     


      // Check if the user already has a cart
      let cart = await cartSchema.findOne({ user: userId });
      console.log(cart);

      if (!cart) {
          // If no cart exists, create a new cart for the user
          cart = new cartSchema({
              user: userId,
              items: [{ productId, quantity }]
          });
          await cart.save();
          return res.status(201).json({ message: 'Product added to cart' });
      } else {
          // If cart exists, add the product 
          const existingProductIndex = cart.items.findIndex(
              (item) => item.productId.toString() === productId
          );

          // If product already exists, update quantity
          if (existingProductIndex > -1) {
              cart.items[existingProductIndex].quantity += quantity;
          } else {
              // Add the new product to the cart
              cart.items.push({ productId, quantity });
          }

          // Save the updated cart
          await cart.save();
          return res.status(200).json({ message: 'Product added in cart' });
      }
  } catch (error) {
      console.error('Error in adding to cart:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
const viewCart = async (req, res) => {
    try {
      // get user id
      const userId = req.user.id;
  
     
      // Find the cart for the user
      const cart = await cartSchema.findOne({ user: userId }).populate('products', 'name price');
  
      // Check if the user has a cart
      if (!cart || cart.items.length === 0) {
        return res.status(404).json({ message: "Cart is empty" });
      }
  
      // Calculate the total price of the cart
      const totalPrice = cart.items.reduce((total, item) => {
        return total + item.productId.price * item.quantity;
      }, 0);
  
      // Send  a response
      return res.status(200).json({
        message: "Cart fetched successfully",
        cart: {
          items: cart.items.map((item) => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.quantity,
            totalItemPrice: item.productId.price * item.quantity,
          })),
          totalPrice,
        },
      });
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  
  


 module.exports = { addproducttocart,viewCart} ;
