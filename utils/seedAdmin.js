import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";   // adjust path if needed
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    
//   const hashedPassword = await bcrypt.hash("admin123", 10);
//   await Admin.create({ username: "admin", password: hashedPassword });
//   console.log("✅ Admin created");
//   process.exit();
});
