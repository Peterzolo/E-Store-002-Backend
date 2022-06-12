const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const crypto = require("crypto");

const User = require("./user.model");
const VerifyToken = require("../user/VerificationToken");
const userError = require("./user.error");

const config = require("../../config");

const logger = require("../../library/helpers/loggerHelpers");
const jwtHelpers = require("../../library/helpers/jwtHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");

const { generateOTP } = require("../../library/helpers/utils/utility");

exports.checkUserExist = async (query) => {
  const user = await findUser({ ...query });

  if (!user) {
    return false;
  }

  return true;
};

exports.findAUser = async (query) => {
  const user = await User.findOne(query);
  return user;
};

exports.verifyUserToken = async (query) => {
  const verify = await VerifyToken.findOne(query);
  return verify;
};

exports.findUserById = async (id) => {
  const user = await User.findById({ _id: id });
  return user;
};

exports.signUp = async ({
  formattedFirstName,
  formattedLastName,
  email,
  password,
  verified,
  isAdmin,
  status,
}) => {
  let avatar = await gravatar.url(email, {
    s: "200", // Size
    r: "pg", // Rating
    d: "mm", // Default
  });

  let UserObj = {
    firstName: formattedFirstName,
    lastName: formattedLastName,
    email,
    password,
    verified,
    avatar,
    isAdmin,
    status,
  };

  const newUser = new User(UserObj);

  const OTP = generateOTP();

  let token = jwtHelpers.encode({
    email: newUser.email,
    userId: newUser._id,
    isAdmin: newUser.isAdmin,
  });

  const verifyToken = new VerifyToken({
    owner: newUser._id,
    token: OTP,
  });

  await verifyToken.save();
  await newUser.save();

  exports.saveOTP = async () => {
    const savedOtp = await verifyToken.token;

    console.log("NEW SAVED OPT", savedOtp);
    return savedOtp;
  };

  logger.info(`Auth token created: ${token}`);

  return {
    // token: `${config.tokenType} ${token}`,
    otp: verifyToken.token,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
    verified: newUser.verified,
    avatar: newUser.avatar,
    isAdmin: newUser.isAdmin,
    status: newUser.status,
  };
};

exports.authenticate = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    logger.warn("Authentication failed. Wrong credential.");
    throw userError.WrongCredential();
  }
  if (user.status === "inactive") {
    logger.warn("user account not activated");
    throw userError.Inactive();
  }

  if (user.verified === false) {
    throw userError.UnverifiedUser();
  }
  const isValidPassword = await bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    logger.warn("Authentication failed. Wrong credential.");
    throw userError.WrongCredential();
  }

  let token = jwtHelpers.encode({
    email: user.email,
    userId: user._id,
    isAdmin: user.isAdmin,
  });

  logger.info(`Auth token created: ${token}`);
  return {
    token: `${config.tokenType} ${token}`,
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      status: user.status,
    },
  };
};

exports.findAllUsers = async () => {
  const user = await User.find({ status: "active" })
    .populate("")
    .select("-password");
  return user;
};

exports.findUserByEmail = async (email) => {
  const user = await findUser({ email });

  if (!user) {
    logger.warn("Authentication failed. User not found.");
    throw userError.UserNotFound("Authentication failed. User not found.");
  }

  return user;
};

const findUser = async (query = {}, selectQuery = "", findMode = "one") => {
  const user = await User.find(query).select(selectQuery).exec();
  if (findMode === "one") {
    return user[0];
  }
  return user;
};

exports.deleteUser = async (id) => {
  let deletedUser = await User.findByIdAndUpdate(
    id,
    { status: "inactive" },
    { new: true }
  );

  return deletedUser;
};

exports.fetchUser = async (id) => {
  let singleUser = await User.findOne(id).select("-password");
  return singleUser;
};

exports.removeUser = async (id, userId) => {
  const user = await User.findOneAndUpdate(
    { _id: id, user: userId },
    { $set: { status: "inactive" } },
    { new: true }
  );
  return user;
};

exports.updateUser = async (id, userId, userObj) => {
  const user = await User.findByIdAndUpdate(
    { _id: id, user: userId },
    { $set: userObj },
    { new: true }
  ).populate("business");
  return user;
};

exports.userIsAmin = async (id) => {
  const isAdmin = await User.findOne(
    { _id: id },
    { isAdmin: true, active: true }
  );
  return isAdmin;
};
