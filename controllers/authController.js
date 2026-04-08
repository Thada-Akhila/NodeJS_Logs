import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/jwt.js";



// JWT-based auth code

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { id: user._id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token in DB
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(401).json({ message: "No token" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Token expired" });

      const newAccessToken = generateAccessToken({
        id: user._id,
        email: user.email
      });

      res.json({ accessToken: newAccessToken });
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LOGOUT jwt-based logout simply clears the refresh token from the database, effectively invalidating any future token refresh attempts for that user.
export const logout = async (req, res) => {
  const { token } = req.body;

  await User.findOneAndUpdate(
    { refreshToken: token },
    { refreshToken: null }
  );

  res.json({ message: "Logged out" });
};

export const getProfile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.json({
    message: "Profile fetched",
    user: req.session.user
  });
};




//register code remains the same as session-based and jwt-based auth share the same registration logic
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





//session-based auth code (commented out for now)

// // LOGIN
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     //  CREATE SESSION
//     req.session.user = {
//       id: user._id,
//       email: user.email
//     };

//     console.log(req.session);

//     res.json({
//       message: "Login successful",
//       session: req.session
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // LOGOUT
// export const logout = (req, res) => {
//   req.session.destroy(() => {
//     res.json({ message: "Logged out" });
//   });
// };


// // PROTECTED ROUTE
// export const getProfile = (req, res) => {
//   if (!req.session.user) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   res.json({
//     message: "Profile fetched",
//     user: req.session.user
//   });
// };