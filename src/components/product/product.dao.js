import Product from './product.model.js';

export const saveProductPayload = async (args) => {
  const payload = await Product.create(args);
  return payload;
};

export const fetchAllProducts = async () => {
  const product = await Product.find({ status: 'active' });
  return product;
};

export const findProductById = async (id) => {
  const product = await Product.findById({ _id: id, status: 'active' });
  return product;
};

// export const findOneProduct = async(id) =>{
//   const product = await Product.findById({_id : id})
//   return product
// }

export const findProductByName = async (query) => {
  const product = await Product.findOne(query);
  return product;
};

export const updateProduct = async (id, productObj) => {
  const product = await Product.findByIdAndUpdate(
    { _id: id },
    { $set: productObj },
    { new: true }
  );
  return product;
};

export const deleteProduct = async (id, userId) => {
  const product = await Product.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: { status: 'inactive' } },
    { new: true }
  );
  return product;
};

export const findProductOwnerById = async (id) => {
  const product = await Product.find({ status: 'active', vendor: id }).populate(
    'vendor',
    '-password'
  );
  return product;
};
