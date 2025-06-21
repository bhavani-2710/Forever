import mongoose from 'mongoose';

/*
   {
        _id: "aaaaw",
        name: "Boy Round Neck Pure Cotton T-shirt",
        description: "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.",
        price: 180,
        image: [p_img23],
        category: "Kids",
        subCategory: "Topwear",
        sizes: ["S", "M", "L", "XL"],
        date: 1716636545448,
        bestseller: false
    }
*/

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  sizes: {
    type: Array,
    required: true
  },
  bestSeller: {
    type: Boolean
  },
  date: {
    type: Number,
    required: true
  }
});

const productModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default productModel;
