const mongoose = require('mongoose');
const wishlistSchema = new  mongoose.Schema({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',// reference to the user model
        required:true
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'//reference to the product model
        }
    ]
});

module.exports = mongoose.model('wishlist',wishlistSchema);
