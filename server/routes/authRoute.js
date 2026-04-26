import passport from "passport";
import jwt from "jsonwebtoken"
import { Router } from "express";
const router = Router()
import dotenv from "dotenv"
import { authenticateToken, authToken } from "../middleware/auth.js";
dotenv.config()


// Step 1: user Google Login
router.get(
  "/google/user",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 1: Vendor Google Login 
router.get("/google/vendor",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "vendor", // 👈 important
  })
);

// Step 2: Callback both
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),

  async (req, res) => {

    // Assign role based on state
    if (req.query.state === "vendor") {
      req.user.role = "vendor";
      await req.user.save();
    }

    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "200d" }
    );

    // Redirect based on role
    if (req.query.state === "vendor") {

      res.cookie("U_AU", token, {
        httpOnly: true,
        secure: true, // true in production (HTTPS)
        sameSite: "None",
      });
      return res.redirect("https://vendor.byslot.online/success");
    } else {

      res.cookie("UA", token, {
        httpOnly: true,
        secure: true, // true in production (HTTPS)
        sameSite: "None",
      });
      return res.redirect("https://byslot.online/success");
    }

  }
);

// step 3: save vendor cookie
router.get("/vendor/cookie", (req, res) => {
  const token = req.cookies?.U_AU;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// step 4: save user cookie
router.get("/user/cookie", (req, res) => {
  const token = req.cookies?.UA;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

router.get('/vendor/protected', authenticateToken, (req, res) => {
  res.json({ user: req.user.id })
});

router.get('/user/protected', authToken, (req, res) => {
  res.json({ user: req.UA.id })
})

// logout route
router.post("/vendor/logout", authenticateToken, (req, res) => {
  res.clearCookie("U_AU", {
        httpOnly: true,
        secure: true, // true in production (HTTPS)
        sameSite: "None",
      });

  return res.status(200).json({ message: "Logged out successfully" });
});

router.post("/user/logout", authToken, (req, res) => {

  console.log('get')

   res.clearCookie("UA", {
        httpOnly: true,
        secure: true, // true in production (HTTPS)
        sameSite: "None",
      });

  return res.status(200).json({ message: "Logged out successfully" });
})

export default router