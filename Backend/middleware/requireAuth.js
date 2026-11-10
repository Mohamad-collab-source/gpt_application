
import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {

  // Read the JWT from the cookie
  const token = req.cookies?.token;

  // Reject requests without a token
  if (!token) {
    return res.status(401).json({
      message: "Please log in first"
    });
  }

  try {
    // Verify the token's signature and expiration
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Attach the authenticated user's ID to the request
    req.userId = decoded.userId;

    // Continue to the route handler
    next();

  } catch {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

export default requireAuth;
