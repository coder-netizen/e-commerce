

const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    parentcategory:{type:String,required:true},
    
},
{timestamps:true} // this will automatically adds created at updated at fields

);
module.exports = mongoose.model('category',categorySchema);
