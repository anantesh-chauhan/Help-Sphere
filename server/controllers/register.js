const User = require('../models/User');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email : email});
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();

        return res.status(201).json({
            success:"true",
            message: 'User registered successfully',
        });    
    }
    catch (error) {
        // console.error("Error checking existing user:", error);
        // return res.status(500).json({ message: 'Internal server error' });
        next(error);
    }
}

module.exports = register;