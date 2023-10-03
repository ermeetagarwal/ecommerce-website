import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import ejs from "ejs";
import cors from "cors";
import connectDB from "./config/db.js";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'; // Added for JWT
import bcrypt from "bcrypt"; // Added for password hashing
// Importing all routes
import homeRouter from "./routes/home.js";
import productRouter from "./routes/product.js";
import userRouter from "./routes/user.js";
import Cart from "./routes/cart.js";


const allowedOrigins = ["http://0.0.0.0:5500"];

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the requesting origin is allowed
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
// Passport Setup.
// Configure Passport for JWT strategy
passport.use(new JwtStrategy({
  secretOrKey: process.env.SECRET, // Change this to your secret key
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (jwtPayload, done) => {
  try {
    const user = await User.findById(jwtPayload.userId);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
}));
app.use("/api/home", homeRouter);
app.use("/api/product", productRouter);
app.use("/user",userRouter);
app.use("/cart",Cart)
connectDB();
app.listen(3000, () => {
  console.log("Server started at port 3000");
});
