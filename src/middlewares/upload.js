import sharp from 'sharp';

const createThumbnail = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }

  const uploadedImagePath = req.file.path;
  const thumbnailImagePath = uploadedImagePath + '_thumb';

  console.log('Uploaded image path:', uploadedImagePath);
  console.log('Thumbnail image path:', thumbnailImagePath);

  await sharp(uploadedImagePath)
    .resize(160, 160)
    .png()
    .toFile(thumbnailImagePath);

  next();
};

export {createThumbnail};
