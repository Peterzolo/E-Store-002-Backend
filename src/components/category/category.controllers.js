const { validationResult } = require("express-validator");
const categoryService = require("./category.services");

const categoryError = require("./category.error");

const { sendResponse } = require("../../library/helpers/responseHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");

exports.createCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw categoryError.InvalidInput(errors.mapped());
  }

  const categoryData = req.body;
  const savedCategory = await categoryService.createCategory(categoryData);

  return res.status(200).send(
    sendResponse({
      message: "condition created successfully",
      content: savedCategory,
      success: true,
    })
  );
};

// exports.getMyCategories = async (req, res) => {
//   let ownerId = req.ownerId;
//   const categorys = await categoryService.fetchMyCategories(ownerId);

//   if (!categorys.length) {
//     throw categoryError.NotFound();
//   }
//   return res.status(200).send(
//     sendResponse({
//       message: "categorys successfully loaded",
//       content: { categoryCount: categorys.length, Allcategory: categorys },
//       success: true,
//     })
//   );
// };

exports.getAllCategoriesByAdmin = async (req, res) => {
  //   let ownerId = req.ownerId;
  const categories = await categoryService.fetchCategoriesByAdmin();

  if (categories.length < 1) {
    throw categoryError.NotFound();
  }
  return res.status(200).send(
    sendResponse({
      message: "categorys successfully loaded",
      content: categories,
      success: true,
    })
  );
};

exports.getSingleCategory = async (req, res) => {
  try {
    let categoryId = req.params.id;
    // let owner = req.ownerId;

    if (isEmpty(categoryId)) {
      throw categoryError.NotFound("Please specify a category to delete");
    }
    const category = await categoryService.fetchSingleCategory(categoryId);
    if (!category || category.status === "inactive") {
      throw categoryError.NotFound();
    }
    return res.status(200).send(
      sendResponse({
        message: "categorys successfully loaded",
        content: category,
        success: true,
      })
    );
  } catch (error) {
    res.status(500).send({ error, message: "Error finding category" });
  }
};

exports.updateCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw categoryError.InvalidInput(errors.mapped());
  }

  let updateData = req.body;
  const { categoryId } = req.params;


  if (isEmpty(categoryId)) {
    throw categoryError.NotFound("Please specify a category to edit");
  }

  const category = await categoryService.fetchSingleCategory(categoryId);
  if (!category || category.status === "inactive") {
    throw categoryError.NotFound();
  }

  console.log('CATEGORYY',category)

  const query = categoryId;
  const update = updateData;

  let editedCategory = await categoryService.editCategory(
    query,
    update
  );

  if (!editedCategory) {
    throw categoryError.NotFound();
  }
  return res.status(200).send(
    sendResponse({
      message: "category updated",
      content: editedCategory,
      success: true,
    })
  );
};

exports.deleteCategory = async (req, res) => {
  try {
    let deleteData = req.body.status;
    const { id } = req.params;
    const owner = req.ownerId;
    const categoryExists = await categoryService.categoryExists({ _id: id });
    if (!categoryExists || categoryExists.status === "inactive") {
      throw categoryError.NotFound();
    }

    const categoryDelete = await categoryService.deleteOneCategory(
      id,
      owner,
      deleteData
    );

    if (!categoryDelete) {
      res.status(402).send({ Not_found: "Could not find category" });
    } else {
      res
        .status(201)
        .send({ Success: `Successfully deleted ${categoryDelete}` });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
