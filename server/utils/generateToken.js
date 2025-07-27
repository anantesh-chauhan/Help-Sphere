const jwt = require('jsonwebtoken');

const generateToken = (email) => {

    const accessToken = jwt.sign(
        {
            email: email,
        }
        , process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    }   
    )
    // console.log("Access Token in generateToken:", accessToken);
    return accessToken;
}

module.exports = generateToken;