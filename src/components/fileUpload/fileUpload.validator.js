const { check } = require('express-validator');

const message = {
	businessName: 'Property name must be only letters with min of 3',
};

exports.validateBusiness = () => {
	return [
		check('propertyName', message.businessName).isString().isLength({ min: 3 }).trim(),
		// check('address', message.address).isString().isLength({ min: 3 }).trim()
		// check("description").isString(),
		// check("state").isString(),
		// check("priority").isString(),
	];
};
