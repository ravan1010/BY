import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import connectDB from "./utili/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import "./config/passport.js";

// Importing routes
// Importing auth routes
import authRoutes from "./routes/authRoute.js";

// Importing details routes
import detailsRoutes from "./routes/DetailsRoute.js";

// Importing event post routes
import eventPostRoutes from "./routes/eventpostRoute.js";

// Importing user profile routes
import userProfileRoutes from "./routes/userRoutes/userProfileRoute.js";

// Importing user UI routes
import userUIRoute from "./routes/userRoutes/userUIRoute.js";

// importing vendor Dashboard
import vendorDashboard from "./routes/vendorDashboard.js";

// importing vendor booking
import vendorBooking from "./routes/vendorBooking.js"

// importing main vendor active page
import vendorActive from "./routes/mainRoute/vendorActive.js"

dotenv.config();

const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true, // frontend URL
    credentials: true,
  })
);


app.use(passport.initialize());

app.use("/auth", authRoutes); 
app.use("/api", detailsRoutes);
app.use("/api", eventPostRoutes);
app.use("/api", vendorDashboard);
app.use("/api", vendorBooking);
app.use("/api/user", userProfileRoutes);
app.use("/api/user", userUIRoute);
app.use('/main', vendorActive);


connectDB();
app.listen(5000, () => console.log("Server running on port 5000"));
 