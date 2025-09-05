import express from "express";
import bcrypt from "bcrypt";
import Admin from "../models/Admin.js";
import Product from "../models/Product.js";
import Slider from "../models/Slider.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// Middleware
function isAuthenticated(req, res, next) {
  if (req.session.adminId) return next();
  res.redirect("/admin/login");
}

// Login routes
router.get("/login", (req, res) => res.render("admin/login", { error: null }));
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) return res.render("admin/login", { error: "Invalid username or password" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.render("admin/login", { error: "Invalid username or password" });

  req.session.adminId = admin._id;
  res.redirect("/admin/dashboard");
});
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});

// Dashboard
router.get("/dashboard", isAuthenticated, async (req, res) => {
  const products = await Product.find();
  const sliders = await Slider.find();
  res.render("admin/dashboard", { products, sliders });
});

// Add Product
router.post("/product/add", isAuthenticated, upload.single("image"), async (req, res) => {
  const { name, price } = req.body;
  await Product.create({ name, price, image: req.file.path });
  res.redirect("/admin/dashboard");
});

// Edit Product Page
router.get("/product/edit/:id", isAuthenticated, async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.render("admin/editProduct", { product });
});

// Update Product
router.post("/product/edit/:id", isAuthenticated, upload.single("image"), async (req, res) => {
  const { name, price } = req.body;
  const updateData = { name, price };
  if (req.file) updateData.image = req.file.path;
  await Product.findByIdAndUpdate(req.params.id, updateData);
  res.redirect("/admin/dashboard");
});

// Delete Product
router.get("/product/delete/:id", isAuthenticated, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect("/admin/dashboard");
});

// Add Slider
router.post("/slider/add", isAuthenticated, upload.single("image"), async (req, res) => {
  const { title } = req.body;
  await Slider.create({ title, image: req.file.path });
  res.redirect("/admin/dashboard");
});

// Edit Slider Page
router.get("/slider/edit/:id", isAuthenticated, async (req, res) => {
  const slider = await Slider.findById(req.params.id);
  res.render("admin/editSlider", { slider });
});

// Update Slider
router.post("/slider/edit/:id", isAuthenticated, upload.single("image"), async (req, res) => {
  const { title } = req.body;
  const updateData = { title };
  if (req.file) updateData.image = req.file.path;
  await Slider.findByIdAndUpdate(req.params.id, updateData);
  res.redirect("/admin/dashboard");
});

// Delete Slider
router.get("/slider/delete/:id", isAuthenticated, async (req, res) => {
  await Slider.findByIdAndDelete(req.params.id);
  res.redirect("/admin/dashboard");
});

export default router;
