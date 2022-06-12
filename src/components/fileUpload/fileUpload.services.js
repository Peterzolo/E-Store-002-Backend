const { isEmpty } = require("../../library/helpers/validationHelpers");


const singleFileError = require("./fileUpload.error");

const SingleFile = require("./fileUpload.model");

exports.SingleFileExists = async (name) => {
  const singleFile = await SingleFile.findOne(name);
  return singleFile;
};

const findAndPopulate = async (
  query = {},
  selectQuery = {},
  path = "user product",
  pathQuery = "-password",
  findMode = "one",
  sortQuery = { _id: -1 }
) => {
  const singleFile = await SingleFile.find(query)
    .select(selectQuery)
    .populate({
      path: path,
      select: pathQuery,
    })
    .sort(sortQuery);

  if (findMode === "one") {
    return singleFile[0];
  }
  return singleFile;
};

const saveSingleFileWithPayload = async (payload = {}) => {
  const singleFile = new SingleFile(payload);
  await singleFile.save();

  return singleFile;
};
exports.createSingleFile = async (payload) => {
  const singleFile = await saveSingleFileWithPayload(payload);

  const savedSingleFile = await findAndPopulate({ _id: singleFile._id }, null);

  return savedSingleFile;
};

const findSingleFile = async (query = {}, findMode = "one") => {
  const singleFile = await SingleFile.find(query);
  if (findMode === "one") {
    return singleFile[0];
  }
  return singleFile;
};

exports.findSingleFileById = async (id) => {
  const singleFile = await SingleFile.findById({ _id: id });
  return singleFile;
};

exports.checkSingleFileusership = async (userId) => {
  const singleFile = await findSingleFile({ userId });

  if (isEmpty(singleFile)) {
    return false;
  }

  return true;
};

exports.fetchAllSingleFiles = async () => {
  const singleFile = await SingleFile.find().populate("user product", "-password");
  return singleFile;
};

exports.fetchSingleFilesByAdmin = async () => {
  const allSingleFiles = await SingleFile.find({
    active: true,
  }).populate("user product", "-password");
  return allSingleFiles;
};
exports.fetchUserSingleFile = async (_id) => {
  const singleFile = await SingleFile.find({
    user: _id,
    active: true,
  }).populate("user product", "-password");
  return singleFile;
};

exports.fetchSingleSingleFile = async (id, userId) => {
  let singleSingleFile = await SingleFile.findOne({
    _id: id,
    user: userId,
    active: true,
  }).populate("user product", "-password");
  return singleSingleFile;
};

exports.editSingleFile = async (id, userId, singleFile) => {
  const updatedSingleFile = await SingleFile.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: singleFileObj },
    { new: true }
  ).populate("user product", "-password");
  return updatedSingleFile;
};

exports.deleteOneSingleFile = async (id, userId) => {
  let deletedSingleFile = await SingleFile.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { active: false } },
    { new: true }
  );
  return deletedSingleFile;
};
