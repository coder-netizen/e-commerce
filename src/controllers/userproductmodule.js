const productSchema = require('../models/productSchema');

const getproductdetails = async (req,res) => {
    try {
       // const{productId} = req.params;
        const product = await productSchema.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"product not found"});
        }
        res.status(200).json(product);
    } catch (error) {
        console.error("error getting product details",error.message)
    }
}
module.exports = {getproductdetails};