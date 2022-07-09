class ApiError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static internal(msg) {
    return new ApiError(500, msg);
  }

  static forbidden(msg) {
    return new ApiError(403, msg);
  }
  static notFound(msg) {
    return new ApiError(401, msg);
  }
  static wrongCredential(msg) {
    return new ApiError(401, msg);
  }
  static alreadyExists(msg) {
    return new ApiError(409, msg);
  }
  static fieldRequired(msg) {
    return new ApiError(409, msg);
  }
 
}

export default ApiError;
