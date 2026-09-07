import multer from 'multer';
import sharp from 'sharp';

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      const error = new Error('Only images and videos are allowed!');
      error.status = 400;
      cb(error, false);
    }
  },
});

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  if (!req.file.mimetype.startsWith('image/')) {
    return next();
  }

  try {
    const uploadedImagePath = req.file.path;
    const thumbnailImagePath = uploadedImagePath + '_thumb';

    console.log('Uploaded image path:', uploadedImagePath);
    console.log('Thumbnail image path:', thumbnailImagePath);

    await sharp(uploadedImagePath)
      .resize(160, 160)
      .png()
      .toFile(thumbnailImagePath);

    next();
  } catch (error) {
    next(error);
  }
};

export {upload, createThumbnail};
