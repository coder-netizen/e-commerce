const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required :true,
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products',
                required :true,
            },
            quantity:{
                type:Number,
                required:true,
                min:1,
            },
           
        }],
        totalprice:{
            type:Number,
            required:true,
            default:0,
        }

});
module.exports = mongoose.model('cart',cartSchema);
