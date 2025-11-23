import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: null },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  description: { type: String, default: "" },
  inStock: { type: Boolean, default: true },
  isNewItem: { type: Boolean, default: false },
  isSale: { type: Boolean, default: false },
  image: { type: String, default: null }, // path like /uploads/image-123.png
});

export default mongoose.model("Product", ProductSchema);
