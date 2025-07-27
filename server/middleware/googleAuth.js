const { Cookie } = require('express-session');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const googleAuth =async (req, res, next) => {
   //  console.log(req.user?._json);

    try{
       const existingUser =await User.findOne({ email: req.user?._json?.email });
       let newUser;
       if(!existingUser) {
            newUser = new User({
               name: req.user?._json?.name,
               email: req.user?._json?.email,
           });

           await newUser.save();
         //   console.log("New user created:", newUser);
       }else{
        console.log("Existing user found:", existingUser);
       }
       
         const accessToken = generateToken(
            existingUser ? existingUser.email : newUser.email
         )
         console.log("Access Token Generated at middleware:", accessToken);
        
         res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            sameSite: 'Strict', // Adjust as needed
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
         }
        )
        
       next();
    }
    catch (err){
        console.error("Error in googleAuth middleware:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
    next();
}

module.exports = googleAuth;