import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    model: {
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

    stockCount: { type: String, required : true },

    brand: { type: String, required : true },

    reviews: { type: Number, default : 0 },

    rating: { type: Number, default : 0 }, 

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
