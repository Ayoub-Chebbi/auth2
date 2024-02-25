const crypto = require('crypto');
const User = require("../models/model");

module.exports.CreateUser = async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        // Hash the password
        const hashedPassword = hashPassword(password); //erreur

        // Create a new user
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports.LoginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send('Invalid username or password');
        }

        // Check if the password matches
        if (validatePassword(password, user.password)) {
            // Set session userId
            req.session.userId = user.id;
            return res.send('Login successful');
        }

        res.status(401).send('Invalid username or password');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports.LogoutUser = async (req, res) => {
    try {
        // Destroy session
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Error destroying session');
            }
            res.send('Logged out successfully');
        });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).send('Internal Server Error');
    }
}

// Function to hash the password
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}

// Function to validate the password
function validatePassword(password, hashedPassword) {
    const [salt, originalHash] = hashedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === originalHash;
}
