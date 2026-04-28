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


export const auth = (req, res, next) => {
  // 1. Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log(token)

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // 2. Verify token using your Secret Key
    
    // 3. Add the user ID to the request object
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

