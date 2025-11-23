import Product from "../models/Product.js";
import path from "path";
import fs from "fs";

// ⭐ GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⭐ ADD product
export const addProduct = async (req, res) => {
  try {
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
    res.status(500).json({ message: err.message });
  }
};

// ⭐ UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // update all fields
    product.name = req.body.name;
    product.price = req.body.price;
    product.originalPrice = req.body.originalPrice || null;
    product.category = req.body.category;
    product.stock = req.body.stock;
    product.description = req.body.description || "";
    product.inStock = req.body.inStock === "true";
    product.isNewItem = req.body.isNewItem === "true";
    product.isSale = req.body.isSale === "true";

    // update new image (if uploaded)
    if (req.file) {
      // remove old image from folder IF EXISTS
      if (product.image) {
        const oldImgPath = path.join("uploads", path.basename(product.image));
        if (fs.existsSync(oldImgPath)) fs.unlinkSync(oldImgPath);
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    await product.save();
    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ⭐ DELETE product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // delete image from uploads folder
    if (product.image) {
      const imgPath = path.join("uploads", path.basename(product.image));
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
