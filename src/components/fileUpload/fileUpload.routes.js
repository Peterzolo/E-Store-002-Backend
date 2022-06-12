const express = require("express");
const upload = require("../../library/file-upload");
const singFileRouter = express.Router();

const { catchErrors } = require("../../library/helpers/errorFormatHelpers");

const { getAuthorize } = require("../../library/middlewares/authMiddleware");

const singFileController = require("./fileUpload.controllers");

const { validateSingFile } = require("./fileUpload.validator");

singFileRouter.post(
  "/create",
  getAuthorize,
  upload.single("productImage"),
  catchErrors(singFileController.uploadSingleFile)
);

singFileRouter.get(
  "/fetch-singFile",
  catchErrors(singFileController.getMySingFiles)
);
singFileRouter.get(
  "/fetch-all-by-admin",
  getAuthorize,
  catchErrors(singFileController.getAllFilesByAdmin)
);
singFileRouter.put(
  "/edit/:singFileId",
  getAuthorize,
  catchErrors(singFileController.updateSingFile)
);
singFileRouter.delete(
  "/remove/:singFileId",
  getAuthorize,
  catchErrors(singFileController.deleteSingFile)
);
singFileRouter.get(
  "/fetch-one/:id",
  getAuthorize,
  catchErrors(singFileController.getSingFile)
);
singFileRouter.get(
  "/fetch/:id",
  getAuthorize,
  catchErrors(singFileController.getUserSingFiles)
);

module.exports = singFileRouter;
