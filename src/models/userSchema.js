const mongoose = require('mongoose');
const userSchema =  mongoose.Schema({

  name:{type:String,required:true},
  password:{type:String,required:true},
  email:{type:String,required:true,unique:true},
  phone:{type:String,required:true},
  role:{type:String,enum:['user','admin'],default:'user'},
  address:{    
    line1:{type:String,required:true},
    line2:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    country:{type:String,required:true},
  }
});
module.exports = mongoose.model("user",userSchema);




    
    

