const product = require('../models/productSchema');
const multer = require('multer');
const path = require('path');
const upload = require('../middlewares/multer');




// Controller function to add a product
const addproduct = async (req, res) => {
    try {
        // Destructure the fields from the request body
        const { name, description, price, category, stock } = req.body;

        // Validate required fields
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if image files are provided
        if (!req.file ) {
            return res.status(400).send("Image is required");
        }

        // Collect the file paths from req.files
        
        const filepath = req.file.path;


        // Create a new product instance in the database
        const newproduct = new product({
            name,
            description,
            price,
            category,
            stock,
            image: [filepath],
        });

        // Save the product to the database
        await newproduct.save();

        // Send a success response
        res.status(200).json({
            message: "Product added successfully",
        });
    } catch (error) {
        // Handle any errors
        console.error("Error in addproduct:", error.message);
        res.status(500).json({
            message: "Server error",
            error: error.message, 
        });
    }
};

// controller function to view all  product
   const allproducts = async (req,res) => {
    try {
       //view all products
       const products = await product.find({});
       if(!products){
        return res.status(404).json({message:"product not find"});
       }
       //listing all products when sucess
       res.status(200).json({message:"listed all products",products});
        } catch (error) {
         console.error("error in viewing product:",error.message);
         res.status(500).json({message:"server error",error:error.message});
    }
};

// update existing product
  const updateproducts = async(req,res) => {
    try {
        //taking request id
        

        const productId = req.params.id;
        const updates = req.body;
        if(!productId){
            return res.status(404).json({message:"product id is required"});
        }
        //finding from schema and update
        const updatedproduct = await product.findByIdAndUpdate(productId,updates,{new:true});
        if(!updatedproduct){
            return res.status(400).json({message:"cannot update product"});
        }
        res.status(200).json({message:"updated sucessfully"});
    } catch (error) {
        console.error("error in updating product:",error.message);
         res.status(500).json({message:"server error",error:error.message});
    }
  }
  // delete products
   const deleteproducts = async (req,res) => {
    try {
        const productId = req.params.id;
        if(!productId){
            return res.status(404).json({message:"product id is required"});
        }
        const deletedproducts = await Schema.findByIdAndDelete(productId);
        if (!deletedproducts) {
            return res.status(404).json({
              message: "product not found",
            });
          }
          return res.status(200).json({
            message: "product deleted successfully",
          });
      
    } catch (error) {
        res.status(400).json({
            message: "server error  ",
      
    });
}

   };
//product details
 const productdetails = async (req,res) => {
    try {
        const productId = req.params.id
        const productinformation = await product.findById(productId)
        return res.status(200).json({message:"showing the product details"});
    } catch (error) {
        res.status(400).json({message:"error occcurs while showing product details"});
        
    }
 }

  









// Export the function for use in routes
module.exports = {addproduct,allproducts,updateproducts,deleteproducts,productdetails };
