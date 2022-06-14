
import jwt from "jsonwebtoken";


export const authorized = async (req, res, next) => {
  const headerAuthorize =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"]||
    req.headers.authorization;
  if (!headerAuthorize) {
    // logger.warn("Header Authorize Not Found");
    return res.status(404).json({ message: "You are not allowed" });
  }

  const token = headerAuthorize.replace(config.tokenType, "").trim();
    console.log('TOKEN',headerAuthorize)
  try {
    // const decoded = await jwtHelpers.decode(token, config.jwtSecret);
    const decoded = await jwt.verify(token, process.env.JWT_TOKEN_TYPE);

    req.decoded = decoded;
    const email = decoded.payload.email;
    const userId = decoded.payload.userId;
    const isAdmin = decoded.payload.isAdmin;

    req.email = email;
    req.userId = userId;
    req.isAdmin = isAdmin;

    return next();
  } catch (err) {
    // logger.error(`Token Decode Error ${err}`);
    return res.status(401).send({ message: "Invalid Token" });
  }
};
