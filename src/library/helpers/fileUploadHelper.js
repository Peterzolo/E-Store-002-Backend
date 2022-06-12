const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads');
	},
	filename: (req, res, cb) => {
		cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
	}
});

const fileFilter = (req, res, cb) => {
	if (file.mimeType === 'image/png' || file.mimeType === 'image/jpg' || file.mimeType === 'image/jpeg') {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({storage: storage, fileFilter: fileFilter});

module.exports = upload;
