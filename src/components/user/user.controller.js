const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const userService = require("./user.service");
const userError = require("./user.error");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { isValidObjectId } = require("mongoose");
const VerifyToken = require("../user/VerificationToken");
const User = require("../user/user.model");
const ResetToken = require("../user/ResetPassword");

const { sendResponse } = require("../../library/helpers/responseHelpers");
const {
  sentenceCase,
  sentenceCaseNew,
} = require("../../library/helpers/stringHelpers");
const logger = require("../../library/helpers/loggerHelpers");
const { isEmpty } = require("../../library/helpers/validationHelpers");
const {
  generateOTP,
  createRandomBytes,
} = require("../../library/helpers/utils/utility");

exports.userSignUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw userError.InvalidInput(errors.mapped());
  }
  const {
    firstName,
    lastName,
    email,
    password,
    verified,
    isAdmin,
    status,
    token,
  } = req.body;

  let formattedFirstName = sentenceCase(`${firstName}`);
  let formattedLastName = sentenceCaseNew(`${lastName}`);

  const userExist = await userService.checkUserExist({ email });

  if (userExist) {
    throw userError.userExist();
  }

  const user = await userService.signUp({
    formattedFirstName,
    formattedLastName,
    email,
    password,
    verified,
    status,
    isAdmin,
    token,
  });

  // const OTP = generateOTP();

  const sendMail = async (msg) => {
    try {
      await sgMail.send(msg);
      console.log("Email has been sent to your mail box");
    } catch (error) {
      console.error(error);
    }
  };

  const OTP = await userService.saveOTP();

  sendMail({
    to: email,
    from: "petsolstudio@gmail.com",
    subject: "Email Verification Code",
    html: `<div>
    <h3>This is a test Email</h3>
    <h2>${OTP}</h2>
    <p>This is your verification code, copy and paste appropriately</p>
    </div>
   `,
  });

  return res.status(200).send(
    sendResponse({
      message:
        "Thanks for signing up, please check your email for verification code",
      content: user,
      success: true,
    })
  );
};

exports.verifyEmail = async (req, res) => {  
  const { userId, otp } = req.body;

  if (!userId || !otp.trim()) {
    throw userError.InvalidInput();
  }

  if (!isValidObjectId(userId)) {
    throw userError.InvalidInput();
  }

  const user = await User.findById(userId);
  console.log("USER", user);

  if (!user) {
    throw userError.UserNotFound();
  }

  if (user.verified === true) {
    throw userError.userExist();
  }

  const token = await VerifyToken.findOne({ owner: user._id });

  if (!token) {
    throw userError.UserNotFound();
  }

  if (otp !== token.token) {
    throw userError.TokenError();
  }

  user.verified = true;

  await VerifyToken.findByIdAndDelete(token._id);
  await user.save();

  const sendMail = async (msg) => {
    try {
      await sgMail.send(msg);
      console.log("Email verification successful");
    } catch (error) {
      console.error(error);
    }
  };

  sendMail({
    to: user.email,
    from: "petsolstudio@gmail.com",
    subject: "Welcome- you have been verified",
    text: "Email verified successfully",
  });

  res.status(200).send({
    success: true,
    message: " email verified",
    user: {
      name: user.name,
      email: user.email,
      id: user._id,
    },
  });
};

exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw userError.InvalidInput(errors.mapped());
  }

  const { email, password } = req.body;
  const owner = await userService.authenticate(email.toLowerCase(), password);

  return res.status(200).send(
    sendResponse({
      message: "owner successfully logged in",
      content: owner,
      success: true,
    })
  );
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw userError.InvalidInput();
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw userError.UserNotFound();
  }

  const token = await ResetToken.findOne({ owner: user._id });
  if (token) {
    throw userError.TokenRequestError();
  }

  const randomBytes = await createRandomBytes();

  const resetToken = new ResetToken({
    owner: user._id,
    token: randomBytes,
  });
  await resetToken.save();

  const sendMail = async (msg) => {
    try {
      await sgMail.send(msg);
      console.log("Password Reset Link sent");
    } catch (error) {
      console.error(error);
    }
  };

  sendMail({
    to: user.email,
    from: "petsolstudio@gmail.com",
    subject: "Password Reset",
    html: `
                    <h1>Please use the following link to reset your password</h1>  
                    <p> <a href ="#">${process.env.CLIENT_URL}/reset-password?token=${randomBytes}&id=${user._id}</a></p>
                    <hr />
                    <p>This email may contain sensetive information</p>
                    <p>${process.env.CLIENT_URL}</p>
                `,
  });

  res.status(200).send({
    success: true,
    message: "Password reset link has been sent to your email",
  });
};

exports.deleteUser = async (req, res) => {
  let { id } = req.params;
  let userId = req.userId;
  console.log("USER ID", userId);

  if (isEmpty(id)) {
    throw userError.UserNotFound("Please specify a user to delete");
  }

  const findUser = await userService.findAUser({ _id: userId });
  if (req.params.id !== req.userId) {
    throw userError.NotAllowed();
  }

  if (findUser.status === "inactive") {
    throw userError.Inactive();
  }

  const query = { _id: id };
  const queryTwo = userId;

  const deletedUser = await userService.deleteUser(query, queryTwo);

  if (!deletedUser) {
    throw userError.ActionFailed("Unable to delete user");
  }

  const allusers = await userService.findAllUsers();

  return res.status(200).send(
    sendResponse({
      message: "user deleted",
      content: deletedUser,
      success: true,
    })
  );
};

exports.editUser = async (req, res) => {
  let { id } = req.params;
  let userId = req.userId;
  let userObj = req.body;

  const findUser = await userService.findAUser({ _id: userId });

  if (req.params.id !== req.userId) {
    throw userError.NotAllowed();
  }

  if (findUser.status === "inactive") {
    throw userError.Inactive();
  }

  if (isEmpty(id)) {
    throw userError.UserNotFound("Please specify a user to Update");
  }

  // const userExist = await userService.checkUserExist({ _id: userId });

  // if (!userExist) {
  //   throw userError.userNotFound();
  // }

  const query = id;
  const queryTwo = userId;
  const update = userObj;

  const updatedUser = await userService.updateUser(query, queryTwo, update);

  if (!updatedUser) {
    throw userError.ActionFailed("Unable to delete user");
  }

  const allusers = await userService.findAllUsers();

  return res.status(200).send(
    sendResponse({
      message: "user deleted",
      content: updatedUser,
      success: true,
    })
  );
};

exports.getOwnUser = async (req, res) => {
  try {
    let email = req.email;
    // let userId = req.userId;

    if (isEmpty(email)) {
      throw userError.NotFound("Please specify a user to delete");
    }

    const userExist = await userService.checkUserExist({ email });
    if (!userExist) {
      throw userError.UserNotFound();
    }
    const query = { email };
    const user = await userService.fetchUser(query);

    if (!user) {
      throw userError.ActionFailed("Could not find the user");
    } else {
      res.status(201).send({ Success: user });
    }
  } catch (error) {
    res.status(500).send({ error, message: "Something went wrong" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    let userId = req.params.userId;
    console.log("USER ID", userId);

    if (isEmpty(userId)) {
      throw userError.NotFound("Please specify a user to delete");
    }

    const findUser = await userService.findUserById(userId);
    if (!findUser) {
      throw userError.UserNotFound();
    }

    if (!findUser) {
      throw userError.UserNotFound();
    }

    res.status(201).send(
      sendResponse({
        message: "user loaded",
        content: findUser,
        success: true,
      })
    );
  } catch (error) {
    res.status(500).send({ error, message: "Something went wrong" });
  }
};

exports.getAllUsers = async (req, res) => {
  const loggedInUser = req.userId;
  const findUser = await userService.findUserById(loggedInUser);

  if (findUser.isAdmin === false) {
    throw userError.NotAllowed();
  }

  const users = await userService.findAllUsers();

  res.status(201).send(
    sendResponse({
      message: "users loaded",
      content: users,
      success: true,
    })
  );
};
