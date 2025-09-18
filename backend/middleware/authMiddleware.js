import jwt from "jsonwebtoken";
import User from "./models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (err) {
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

export default protect;
