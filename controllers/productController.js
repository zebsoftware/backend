import Product from "../models/Product.js";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// --- HELPER FUNCTIONS ---
const parseBoolean = (value) => value === "true" || value === true;
const parseNumber = (value) => (value !== undefined && value !== null ? Number(value) : null);

// --- GET ALL PRODUCTS ---
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- ADD PRODUCT ---
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      category,
      stock,
      description,
      inStock,
      isNewItem,
      isSale,
    } = req.body;

    const product = new Product({
      name,
      price: parseNumber(price),
      originalPrice: parseNumber(originalPrice),
      category,
      stock: parseNumber(stock),
      description: description || "",
      inStock: parseBoolean(inStock),
      isNewItem: parseBoolean(isNewItem),
      isSale: parseBoolean(isSale),
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await product.save();
    res.status(201).json({ success: true, data: product, message: "Product added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- UPDATE PRODUCT ---
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const {
      name,
      price,
      originalPrice,
      category,
      stock,
      description,
      inStock,
      isNewItem,
      isSale,
    } = req.body;

    product.name = name;
    product.price = parseNumber(price);
    product.originalPrice = parseNumber(originalPrice);
    product.category = category;
    product.stock = parseNumber(stock);
    product.description = description || "";
    product.inStock = parseBoolean(inStock);
    product.isNewItem = parseBoolean(isNewItem);
    product.isSale = parseBoolean(isSale);

    // Handle image replacement
    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(process.cwd(), product.image.replace(/^\//, ""));
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.status(200).json({ success: true, data: product, message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- DELETE PRODUCT ---
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Delete image if exists
    if (product.image) {
      const imgPath = path.join(process.cwd(), product.image.replace(/^\//, ""));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
