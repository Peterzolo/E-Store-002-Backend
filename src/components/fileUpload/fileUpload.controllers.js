const { validationResult } = require("express-validator");
const singleFileService = require("./fileUpload.services");
const userService = require("../user/user.service");
const singleFileError = require("./fileUpload.error");
const SingleFile = require("./fileUpload.model");
const { sendResponse } = require("../../library/helpers/responseHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");
const Aws = require("aws-sdk");

const s3 = new Aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
});

exports.uploadSingleFile = async (req, res) => {
  console.log("REQ.FILE", req.file);

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.originalname,
    Body: req.file.buffer,
    ACL: "public-read-write",
    ContentType: "image/jpeg",
  };

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send({ err: error });
    }

    console.log(data);

    const product = new SingleFile({
      fileName: req.body.name,
      product: req.body.product,
      user: req.body.user,
      productImage: data.Location,
    });
    product
      .save()
      .then((result) => {
        res.status(200).send({
          _id: result._id,
          name: result.name,
          price: result.price,
          productImage: data.Location,
        });
      })
      .catch((err) => {
        res.send({ message: err });
      });
  });
};
