const env = require('dotenv')
const express = require("express");
const port = 3000;
const app = express();
const connectDB = require('./src/configuration/db');
const authentication = require('./routes/router.js');
const { urlencoded } = require('body-parser');
const router = require('./routes/router.js');
const productmodule = require('./src/admincontroller/productmodule');
const wishlistmodule = require('./src/controllers/wishlistmodule');
const cartmodule = require('./src/controllers/cartmodule.js');
const userproductmodule = require('./src/controllers/userproductmodule.js');

env.config();
     







connectDB();
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(router)










app.listen(port,() => {
    console.log("server is running");
});



