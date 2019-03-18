const multer = require('multer');
const path = require('path');
const MulterAzureStorage = require('multer-azure-storage');
const config = require('../config')();

const azureStorage = new MulterAzureStorage({
  azureStorageConnectionString: config.azureString,
  containerName: config.containerName,
  containerSecurity: config.containerSecurity,
});


const productUploads = {};

// const diskStorage = multer.diskStorage({
//   destination: 'divorce-uploads/',
//   filename: (req, file, cb) => {
//     cb(null, `${file.fieldname}-${Date.now()  }${path.extname(file.originalname)}`);
//   },
// });

function checkFileType(file, cb) {
  //   extentions allowed
  const filetypes = /jpeg|jpg|png/;
  // check extention
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime type
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb('Error: Images only');
}

productUploads.saveImage = multer({
  storage: azureStorage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 2000000,
  },
}).array('productThumbnail');


module.exports = productUploads;
