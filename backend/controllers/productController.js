import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// function to add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(item => item !== undefined);

    // converting images to string using cloudinary
    let imagesUrl = await Promise.all(
      images.map(async item => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    // storing in database
    const newProduct = new productModel({
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestSeller: bestSeller === 'true' ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now()
    });
    await newProduct.save();

    return res.status(201).json({ success: true, message: 'Product Added!' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// function to list products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find();

    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// function to remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Product Removed' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// function to fetch single product info
const singleProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
