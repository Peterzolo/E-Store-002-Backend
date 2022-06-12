const User = require("../../components/user/user.model");
const ResetToken = require("../../components/user/ResetPassword");
const { sendError } = require("../helpers/errorMessagehelper");
const { isValidObjectId } = require("mongoose");

exports.isResetTokenValid = async (req, res, next) => {
  const { token, id } = req.query;
  try {
    if (!token || !id) return sendError(res, "Invalid reset request");

    if (!isValidObjectId(id)) return sendError(res, "Invalid user");

    const user = await User.findById(id);
    if (!user) return sendError(res, "User could not be found");

    const resetToken = await ResetToken.findOne({ owner: user._id });

    if (!resetToken) return sendError(res, "Token not found");

    const isValidToken = await resetToken.compareToken(token);

    if (!isValidToken) return sendError(res, "Reset token is not valid");

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, "Could not perform the task");
  }
};
