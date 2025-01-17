const userSchema = require('../models/userSchema');
const verifyToken = require('../middlewares/jsonwebtoken');
const bcrypt = require('bcrypt');


const getprofile = async (req,res) => {
    try {
        const userId = req.user.id;
        const user = await userSchema.findById(userId).select("-password");
        
        res.status(200).json(user); 
    } catch (error) {
        res.status(500).json({error:"error fetching userdetails"});
    }
    
}
const updateprofile = async (req,res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;
        const user = await userSchema.findByIdAndUpdate(userId,updates,{new:true});
        return res.status(200).json(user)
    } catch (error) {
       res.status(500).json({error:"error updating profile"});
    }
}
const updatepassword = async (req,res) => {
    try {
        const userId = req.user.id;
        const{oldpassword,newpassword} = req.body;
        const user = await userSchema.findByIdAndUpdate(userId);
        const ismatch = await bcrypt.compare(oldpassword,user.password);
        if(!ismatch){
            return res.status(400).json({mesasage:"passwords doesn't match"});
        }
        user.password = await bcrypt.hash(newpassword,10);
        await user.save();
        return res.status(200).json({message:"password updated sucessfully"});

    } catch (error) {
        console.error("error updating password",error.message)
    }
}
const deleteaccount = async (req,res) => {
    try {
        const userId = req.user.id;
        const user = userSchema.findByIdAndDelete(userId);
        res.status(200).json({message:"account deleted sucessfully"});
    } catch (error) {
        console.error("error in deleting account",error.message);
    }
}
module.exports = {getprofile,updateprofile,updatepassword,deleteaccount};
