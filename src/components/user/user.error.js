const {
  UNPROCESSABLE_ENTITY,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("http-status-codes");
const { AppError } = require("../../library/helpers/errorFormatHelpers");

module.exports = {
  InvalidInput: (
    content = {},
    message = "Invalid form inputs",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
  userExist: (
    content = {},
    message = "User already exists",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
  UserNotFound: (
    content = {},
    message = "Owner not found.",
    name = null,
    innerException = null
  ) => new AppError(name, NOT_FOUND, message, content, innerException),
  WrongCredential: (
    content = {},
    message = "Wrong credentials.",
    name = null,
    innerException = null
  ) => new AppError(name, UNAUTHORIZED, message, content, innerException),

  TokenNotFound: (
    content = {},
    message = "Token Not Found",
    name = null,
    innerException = null
  ) => new AppError(name, UNAUTHORIZED, message, content, innerException),

  ActionFailed: (
    content = {},
    message = "Action failed",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),

  NotMatched: (
    content = {},
    message = "Password not matched, please try again",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),

  UserVerified: (
    content = {},
    message = "User is already verified",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),

  UnVerified: (
    content = {},
    message = "User not yet verified",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),

  NotAllowed: (
    content = {},
    message = "You are not allowed to perform this task",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
  Inactive: (
    content = {},
    message = "Sorry this Owner is inactive",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
  TokenError: (
    content = {},
    message = "Token Error",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
  UnverifiedUser: (
    content = {},
    message = "This user has not been verified, please verify your account",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
  TokenRequestError: (
    content = {},
    message = " You can only request for another token after 60 minutes",
    name = null,
    innerException = null
  ) =>
    new AppError(name, UNPROCESSABLE_ENTITY, message, content, innerException),
};
