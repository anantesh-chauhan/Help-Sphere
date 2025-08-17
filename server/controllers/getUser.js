const User = require('../models/User');


const getUser = async (req, res , next) =>{
    const email = req.email ;
    // console.log("Request : ", req);
    // console.log("Email : " , email);
    try {
        const findUser = await User.findOne({email : email});

        res.status(200).json({
            success: true ,
            status : true ,
            user : {
                name : findUser.name ,
                email : findUser.email ,
                _id: findUser._id
            }
        })  
        // console.log("User found:", findUser);
    } catch (error) {
        next(error);
    }
}

module.exports = getUser ;