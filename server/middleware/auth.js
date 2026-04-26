import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.U_AU;

  // console.log("Token from cookie:", token); // Debugging log

    if (!token) {  
        return res.json({ message: "No token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
};

export const authToken = (req, res, next) => {
  const token = req.cookies?.UA;

  // console.log("Token in authToken middleware:", token);

    if (!token) {  
        return res.json({ message: "No token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.UA = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: "Invalid token" });
    }
};