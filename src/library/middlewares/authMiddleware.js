const { sendResponse } = require("../helpers/responseHelpers");
const logger = require("../helpers/loggerHelpers");
const config = require("../../config");
const jwtHelpers = require("../helpers/jwtHelpers");

exports.getAuthorize = async (req, res, next) => {
  const headerAuthorize =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization;
  if (!headerAuthorize) {
    logger.warn("Header Authorize Not Found");
    return res.status(404).json(
      sendResponse({
        message: "Header Authorize Not Found",
        success: false,
      })
    );
  }

  const token = headerAuthorize.replace(config.tokenType, "").trim();

  try {
    const decoded = await jwtHelpers.decode(token, config.jwtSecret);

    req.decoded = decoded;
    const email = decoded.payload.email;
    const userId = decoded.payload.userId;
    const isAdmin = decoded.payload.isAdmin;

    req.email = email;
    req.userId = userId;
    req.isAdmin = isAdmin;

    return next();
  } catch (err) {
    logger.error(`Token Decode Error ${err}`);
    return res.status(401).send(
      sendResponse({
        content: err.name,
        message: err.message,
        success: false,
      })
    );
  }
};
