import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/db.js";

const generateAccessToken = (userId) => {
  const secret =
    process.env.ACCESS_TOKEN_SECRET ||
    "your-access-token-secret-key-change-in-production";
  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
};

const generateRefreshToken = (userId) => {
  const secret =
    process.env.REFRESH_TOKEN_SECRET ||
    "your-refresh-token-secret-key-change-in-production";
  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    const userExists = await prisma.user.findFirst({
      where: { email, deleted_at: null },
    });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "Email already in use",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_digest: hashed,
      },
    });

    const accessToken = generateAccessToken(user.id.toString());
    const refreshToken = generateRefreshToken(user.id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        accessToken,
        user: {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await prisma.user.findFirst({
      where: { email, deleted_at: null },
    });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const isMatch =
      user && user.password_digest
        ? await bcrypt.compare(password, user.password_digest)
        : false;
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user.id.toString());
    const refreshToken = generateRefreshToken(user.id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const refreshToken = (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No refresh token provided",
      });
    }

    const secret =
      process.env.REFRESH_TOKEN_SECRET ||
      "your-refresh-token-secret-key-change-in-production";
    const decoded = jwt.verify(token, secret);
    const newAccessToken = generateAccessToken(decoded.userId);

    res.status(200).json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Refresh token expired",
      });
    }
    res.status(401).json({
      success: false,
      error: "Invalid refresh token",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    // Check if req.user exists (middleware might not be active)
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized - User not authenticated",
      });
    }

    const user = await prisma.user.findFirst({
      where: { id: BigInt(req.user.id), deleted_at: null },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { user: userBody } = req.body;
    const { name, phone, address } = userBody || req.body;
    const userId = req.user.id;

    const user = await prisma.user.findFirst({
      where: { id: BigInt(userId), deleted_at: null },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: BigInt(userId) },
      data: {
        name: name ?? undefined,
        phone: phone ?? undefined,
        address: address ?? undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at,
      },
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const userId = req.user.id;

    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ success: false, error: "Missing password fields" });
    }

    const user = await prisma.user.findUnique({
      where: { id: BigInt(userId) },
    });
    if (!user || !user.password_digest) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const ok = await bcrypt.compare(current_password, user.password_digest);
    if (!ok)
      return res
        .status(400)
        .json({ success: false, error: "Current password incorrect" });

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "New password must be at least 6 characters",
      });
    }

    const hashed = await bcrypt.hash(new_password, 10);
    await prisma.user.update({
      where: { id: BigInt(userId) },
      data: { password_digest: hashed },
    });

    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
