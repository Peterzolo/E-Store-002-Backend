const cryptoRandomString = require("crypto-random-string");

exports.randomPassword = () => {
  return Math.random() // Generate random number, eg: 0.123456
    .toString(36) // Convert  to base-36 : "0.4fzyo82mvyr"
    .slice(-8); // Cut off last 8 characters : "yo82mvyr"
};

exports.sentenceCase = (names) => {
  return names
    .split(" ")
    .map(
      (firstName) =>
        firstName.charAt(0).toUpperCase() + firstName.slice(1, firstName.length).toLowerCase()
    )
    .join(" ");
};

exports.sentenceCaseNew = (names) => {
  return names
    .split(" ")
    .map(
      (lastName) =>
        lastName.charAt(0).toUpperCase() + lastName.slice(1, lastName.length).toLowerCase()
    )
    .join(" ");
};

exports.capitalizeString = (name) => {
  return (
    name.charAt(0).toUpperCase() + name.slice(1, name.length).toLowerCase()
  );
};

exports.genCryptoRandomId = (length = 10, type = "base64") => {
  return cryptoRandomString({ length, type });
};
