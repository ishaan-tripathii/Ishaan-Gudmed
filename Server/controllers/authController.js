import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

// Register a new user
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if any field is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Check if user already exists
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: { email: user.email, _id: user._id }, // Don’t send password
    });
  } catch (error) {
    console.log('Registration Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if any field is missing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Please register first',
      });
    }

    // Verify password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password does not match',
      });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1d', // Token expires in 1 day
    });

    // Remove password from response
    const userResponse = { email: user.email, _id: user._id };

    // Set token in cookie and send response
    return res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
      })
      .json({
        success: true,
        message: `Welcome back ${user.email}`,
        token,
        user: userResponse,
      });
  } catch (error) {
    console.log('Login Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.cookie('token', '', {
      httpOnly: true,
      maxAge: 0, // Expire immediately
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.log('Logout Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const user = req.user; // Assuming authentication middleware sets req.user

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      user: { email: user.email, _id: user._id }, // Send only required details
    });
  } catch (error) {
    console.log('Get User Details Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
