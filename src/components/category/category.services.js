const { isEmpty } = require("../../library/helpers/validationHelpers");
const categoryError = require("./category.error");

const Category = require("./category.model");

exports.categoryExists = async (name) => {
  const category = await Category.findOne(name);
  return category;
};

const findAndPopulate = async (
  query = {},
  selectQuery = {},
  path = "user",
  pathQuery = "-password",
  findMode = "one",
  sortQuery = { _id: -1 }
) => {
  const category = await Category.find(query)
    .select(selectQuery)
    .populate({
      path: path,
      select: pathQuery,
    })
    .sort(sortQuery);

  if (findMode === "one") {
    return category[0];
  }
  return Category;
};

const saveCategoryWithPayload = async (payload = {}) => {
  const category = new Category(payload);
  await category.save();

  return category;
};
exports.createCategory = async (payload) => {
  const category = await saveCategoryWithPayload(payload);

  const savedCategory = await findAndPopulate({ _id: category._id }, null);

  return savedCategory;
};

const findCategory = async (query = {}, findMode = "one") => {
  const category = await Category.find(query);
  if (findMode === "one") {
    return category[0];
  }
  return category;
};

exports.checkCategoryOwnership = async (userId) => {
  const category = await findCategory({ userId });

  if (isEmpty(category)) {
    return false;
  }

  return true;
};

exports.fetchCategoriesByAdmin = async () => {
  const allCategorys = await Category.find({ status: "active" })
    .sort({ createdAt: -1 })
    .limit(6);
  return allCategorys;
};

exports.fetchSingleCategory = async (id) => {
  let singleCategory = await Category.findById({
    _id: id,
    status: "active",
  });
  return singleCategory;
};

exports.editCategory = async (id, categoryObj) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    { _id: id },
    { $set: categoryObj },
    { new: true }
  ).populate("owner", "-password");
  return updatedCategory;
};

exports.deleteOneCategory = async (id) => {
  let deletedCategory = await Category.findOneAndUpdate(
    { _id: id },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return deletedCategory;
};

exports.findCategoryById = async (id) => {
  const category = await Category.findById({ _id: id });
  return category;
};
