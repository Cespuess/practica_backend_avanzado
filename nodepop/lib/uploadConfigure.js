const path = require('node:path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const filePath = path.join(
      __dirname,
      '..',
      'public',
      'assets',
      'img',
      'ads'
    );
    callback(null, filePath);
  },
  filename: function (req, file, callback) {
    const filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
