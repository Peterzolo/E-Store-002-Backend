const express = require("express");

const categoryRouter = express.Router();

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");

const { getAuthorize } = require("../../library/middlewares/authMiddleware");

const categoryController = require("./category.controllers");
const { validatecategory } = require("./category.validator");

categoryRouter.post(
  "/create",
  getAuthorize,
  catchErrors(categoryController.createCategory)
);
categoryRouter.get(
  "/fetch-category",

  catchErrors(categoryController.getMyCategory)
);
categoryRouter.get(
  "/fetch-all",
  catchErrors(categoryController.getAllCategoriesByAdmin)
);
categoryRouter.put(
  "/edit/:categoryId",
  getAuthorize,
  catchErrors(categoryController.updateCategory)
);
categoryRouter.delete(
  "/remove/:id",
  getAuthorize,
  catchErrors(categoryController.deleteCategory)
);
categoryRouter.get(
  "/fetch-one/:id",
  catchErrors(categoryController.getSingleCategory)
);

module.exports = categoryRouter;
