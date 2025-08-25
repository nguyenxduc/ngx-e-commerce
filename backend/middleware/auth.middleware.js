import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let accessToken;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.accessToken) {
      accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
      return res
        .status(401)
        .json({ 
          success: false,
          error: "Unauthorized - No access token provided" 
        });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: "User not found" 
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ 
            success: false,
            error: "Unauthorized - Access token expired" 
          });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    return res
      .status(401)
      .json({ 
        success: false,
        error: "Unauthorized - Invalid access token" 
      });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      error: "Access denied - Admin only" 
    });
  }
};

export const sellerRoute = (req, res, next) => {
  if (req.user && (req.user.role === "seller" || req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({ 
      success: false,
      error: "Access denied - Seller privileges required" 
    });
  }
};
