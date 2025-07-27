const User = require('../models/User');
const genrateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const findUser = await User.findOne({ email });

    if (!findUser) {
      const error = new Error("No user found");
      error.statusCode = 400;
      throw error;
    }

    const isPasswordSame = await bcrypt.compare(password, findUser.password);

    if (!isPasswordSame) {
      const error = new Error("Incorrect password");
      error.statusCode = 400;
      throw error;
    }

    const accessToken = genrateToken(findUser.email);

    res.cookie('accessToken', accessToken, {
  httpOnly: true,
  secure: false,               // set to `true` in production with HTTPS
  sameSite: 'lax'              // use 'none' with `secure: true` for cross-origin
});


    res.status(200).json({
      success: true,
      message: "Login success",
      token: accessToken // optional if frontend prefers storing it manually
    });

  } catch (error) {
    next(error);
  }
};

module.exports = login;

// const User = require('../models/User');
// const genrateToken = require('../utils/generateToken');
// const bcrypt = require('bcrypt');

// const login = async (req, res, next) => {

//     const { email, password } = req.body;

//     try {

//         const findUser = await User.findOne({ email: email });

//         if (!findUser) {
//             const error = new Error("no user found");
//             error.statusCode = 400;
//             throw error;
//         }

//         const isPasswordSame = await bcrypt.compare(password, findUser.password);

//         if (!isPasswordSame) {
//             const error = new Error("Incorrect password");
//             const statusCode = 400;
//             throw error;
//         }

//         const accessToken = genrateToken(findUser.email);
//         localStorage.setItem({
//             accessToken : accessToken,
//          })
//         res.cookie('accessToken', accessToken, {
//             sameSite: "none",
//             httpOnly: " true",
//             secure: " true"
//         });
        
//        res.status(200).json({
//         success:"true",
//         message: "login  success"
//        })


//     } catch (error) {
//         next(error);
//     }
// }

// module.exports = login ;