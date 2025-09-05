
import express from "express";
import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import adminRoutes from "./routes/adminRoutes.js";
import bcrypt from "bcrypt";
import Admin from "./models/Admin.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(()=>{
    console.log("✅ MongoDB connected");
  })
  .catch(err => console.error(err));

// Session config
app.use(session({
  secret: "mysecretkey",  // use env variable in production
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
}));

// Routes
app.use("/admin", adminRoutes);

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
