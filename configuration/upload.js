import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'public/',
  filename: (req, file,cb) => cb(null, file.originalname)
});

const upload = multer({ storage, dest: 'public/' }).single('image');

export default upload;
