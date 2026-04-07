import User from "../models/User.js";
import bcrypt from "bcrypt";


// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword
    });

    res.json({ message: "User registered", user });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //  CREATE SESSION
    req.session.user = {
      id: user._id,
      email: user.email
    };

    console.log(req.session);

    res.json({
      message: "Login successful",
      session: req.session
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// LOGOUT
export const logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out" });
  });
};


// PROTECTED ROUTE
export const getProfile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({
    message: "Profile fetched",
    user: req.session.user
  });
};