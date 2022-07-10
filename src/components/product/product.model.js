import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
  
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: '',
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('product', ProductSchema);

export default Product;
