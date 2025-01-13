const mongoose = require('mongoose');
const connectDB = async() => {
    try {
        const connection = await mongoose.connect(process.env.Mongoconnectionstring,
            
         )
       console.log(`mongoDB connected`) 
    } catch (error) {
        console.log("error in connection", error.message)
        
    }
}

module.exports = connectDB;