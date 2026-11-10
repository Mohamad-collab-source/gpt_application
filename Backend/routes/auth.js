
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Create a signed JWT for the user
const createToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// Send JWT through an HttpOnly cookie
const setAuthCookie = (res, userId) => {
  const token = createToken(userId);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000
  });
};

// Remove the authentication cookie
const clearAuthCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
};

// ---------------- SIGNUP ----------------

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message: "Enter a valid name and email. Password must be 8–72 bytes."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save the new user in MongoDB
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    // Authenticate the new user
    setAuthCookie(res, user._id);

    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    // Handle duplicate-email race conditions
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    console.error(error);
    return res.status(500).json({
      message: "Signup failed"
    });
  }
});

// ---------------- LOGIN ----------------

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find the user and explicitly include their password hash
    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    // Compare the entered password with the stored hash
    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create and set the JWT cookie
    setAuthCookie(res, user._id);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Login failed"
    });
  }
});

// CURRENT USER 

router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await User.findById(decoded.userId);

    if (!user) {
      clearAuthCookie(res);

      return res.status(401).json({
        message: "User not found"
      });
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch {
    clearAuthCookie(res);

    return res.status(401).json({
      message: "Invalid or expired session"
    });
  }
});

// ---------------- LOGOUT ----------------

router.post("/logout", (req, res) => {
  clearAuthCookie(res);

  return res.json({
    message: "Logged out successfully"
  });
});

export default router;
