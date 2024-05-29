import path from "node:path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.id}-${file.originalname}`);
  },
});

export default multer({ storage });
