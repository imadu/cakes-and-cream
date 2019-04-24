const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary');
const multerCloudniary = require('multer-storage-cloudinary');
const configs = require('../config')();

cloudinary.config({
  cloud_name: 'rightclick-nigeria',
  api_key: configs.cloudinaryApiKey,
  api_secret: configs.cloudinaryApiSecret,
});

const storageImage = multerCloudniary({
  cloudinary: cloudinary,
  folder: 'cakes-and-cream',
  allowedFormats: ['jpg', 'png'],
  filename: (req, file, cb) => {
    cb(undefined, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});


const productUploads = {};
const categoryUploads = {};

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
  storage: storageImage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 2000000,
  },
}).array('productThumbnail');

categoryUploads.saveImage = multer({
  storage: storageImage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 2000000,
  },
}).single('categoryThumbnail');


module.exports = { productUploads, categoryUploads };
