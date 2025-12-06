import Product from "../models/Product.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⭐ GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⭐ GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ⭐ ADD product
export const addProduct = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);

    const newProduct = new Product({
      name: req.body.name,
      price: req.body.price,
      originalPrice: req.body.originalPrice || null,
      category: req.body.category,
      stock: req.body.stock,
      description: req.body.description || "",
      inStock: req.body.inStock === "true",
      isNewItem: req.body.isNewItem === "true",
      isSale: req.body.isSale === "true",
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newProduct.save();
    res.json({
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ⭐ UPDATE product
export const updateProduct = async (req, res) => {
  try {
    console.log("Uploaded file:", req.file);

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Update text fields
    product.name = req.body.name;
    product.price = req.body.price;
    product.originalPrice = req.body.originalPrice || null;
    product.category = req.body.category;
    product.stock = req.body.stock;
    product.description = req.body.description || "";
    product.inStock = req.body.inStock === "true";
    product.isNewItem = req.body.isNewItem === "true";
    product.isSale = req.body.isSale === "true";

    // Handle new image upload
    if (req.file) {
      // Absolute path to uploads folder
      const uploadsDir = path.join(__dirname, "../uploads");

      // Delete old image (if exists)
      if (product.image) {
        const oldImageName = path.basename(product.image);
        const oldImagePath = path.join(uploadsDir, oldImageName);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ⭐ DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Delete product image
    if (product.image) {
      const uploadsDir = path.join(__dirname, "../uploads");
      const imageName = path.basename(product.image);
      const imgPath = path.join(uploadsDir, imageName);

      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
