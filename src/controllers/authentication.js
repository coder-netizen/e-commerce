

const schema = require('../models/userSchema');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');



const signup = async (req,res) => {
    try {
        const{name, password,email} = req.body
        //check if all fields are available
        if(!name ||!password ||!email){
           return res.status(400).json({
                message:"all fields are required"
            });
        }


        //check if user already exists
        const existinguser = await schema.findOne({email});
       if(existinguser){
          return res.status(409).send('user already exists');
       }
       //hashing password
     const hashedpassword = await bcrypt.hash(password,10)
    //create new user

    const user =  new schema({name,
        password :hashedpassword,
        email},
    );
    await user.save();
    res.status(201).send('user signed up successfully');
           
   } catch (error) {
       console.error(error)
       res.status(500).send('server error');
       
   };
} 
const login = async (req, res) => {
   try {
       const { email, password } = req.body;

       // Check if any fields are missing
       if (!(email && password)) {
           return res.status(400).json({ message: "All fields are required" });
       }

       // Find the user in the database
       const user = await schema.findOne({ email });
       if (!user) {
           return res.status(404).json({ message: "User not found" });
       }

       // Password validation
       const isPasswordValid = await bcrypt.compare(password, user.password);
       if (!isPasswordValid) {
           return res.status(401).json({ message: "Invalid password" });
       }

       // Create token
       const token = jwt.sign({ id: user._id }, process.env.JWTSECRETKEY, { expiresIn: '500h' });

       // Send success response with token
       return res.status(200).json({
           message: "Login successful",
           token: token,
       });

   } catch (error) {
       console.error("Error during login:", error.message);
       return res.status(500).json({ message: "Internal server error" });
   }
};



const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const existingUser = await schema.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User doesn't exist" });
        }

        // Generate a token
        const allow = jwt.sign({ id: existingUser._id }, process.env.secretkey, { expiresIn: '1h' });

        // Create the reset link
        const resetlink = `http://localhost:3000/resetpassword?allow=${allow}`;

        //  nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.Emailid,
                pass: process.env.password,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.Emailid,
            to: existingUser.email,
            subject: "Reset your password",
            text: `Click the link to reset your password: ${resetlink}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Password reset link sent to your email" });
    } catch (error) {
        console.error("Error in forgotpassword:", error); 
        res.status(500).json({ message: "Server error" });
    }
};


 
   


  

  const resetpassword = async(req,res) => {
    try {
      const{allow,newpassword} = req.body;
      const checkuser = jwt.verify(allow,process.env.secretkey);
      const user = await user.findById(allow.id);
      if(!user){
         return res.status(404).json({message:'invalid token'});
      }
      //if it approves update password
      user.password = newpassword;
      newpassword = await bcrypt.hash(newpassword,10);
      await user.save();
      res.status(200).json({message:"password reset successfully"});

   } catch (err) {
      res.status(400).json({message:"invalid token"});
      
   };
  }
  

 




module.exports = {signup,login,forgotpassword,resetpassword};




