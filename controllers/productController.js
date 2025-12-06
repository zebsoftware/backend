import Product from "../models/Product.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ⭐ GET all products - FIXED response structure
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// ⭐ GET single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// ⭐ ADD product - FIXED boolean parsing
export const addProduct = async (req, res) => {
  try {
    console.log("📤 Request body:", req.body);
    console.log("📁 Uploaded file:", req.file);
    console.log("📁 File path:", req.file?.path);

    // Parse boolean values properly
    const inStock = req.body.inStock === "true" || req.body.inStock === true;
    const isNewItem = req.body.isNewItem === "true" || req.body.isNewItem === true;
    const isSale = req.body.isSale === "true" || req.body.isSale === true;

    const newProduct = new Product({
      name: req.body.name,
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      category: req.body.category,
      stock: parseInt(req.body.stock),
      description: req.body.description || "",
      inStock: inStock,
      isNewItem: isNewItem,
      isSale: isSale,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newProduct.save();
    
    console.log("✅ Product saved to DB:", newProduct);
    
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct
    });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// ⭐ UPDATE product - FIXED boolean parsing
export const updateProduct = async (req, res) => {
  try {
    console.log("📤 Update Request body:", req.body);
    console.log("📁 Update Uploaded file:", req.file);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    // Parse boolean values properly
    const inStock = req.body.inStock === "true" || req.body.inStock === true;
    const isNewItem = req.body.isNewItem === "true" || req.body.isNewItem === true;
    const isSale = req.body.isSale === "true" || req.body.isSale === true;

    // Update text fields
    product.name = req.body.name;
    product.price = parseFloat(req.body.price);
    product.originalPrice = req.body.originalPrice ? parseFloat(req.body.originalPrice) : null;
    product.category = req.body.category;
    product.stock = parseInt(req.body.stock);
    product.description = req.body.description || "";
    product.inStock = inStock;
    product.isNewItem = isNewItem;
    product.isSale = isSale;

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

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (err) {
    console.log("❌ Error updating product:", err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

// ⭐ DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

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

    res.status(200).json({ 
      success: true,
      message: "Product deleted successfully" 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};