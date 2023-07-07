const multer = require("multer");
const path = require("path");
const fs = require("fs");
var appRoot = require("app-root-path");

const uploadFile = (
  field,
  folderDes = "users",
  fileSizeMb = 3,
  fileExtension = "jpeg|jpg|png|gif|jfif"
) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, appRoot + `/public/backend/upload/${folderDes}`);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: fileSizeMb * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      const filetypes = new RegExp(fileExtension);
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error("Upload failed. Invalid file type or extension."));
      }
    },
  }).array(field, 4);

  return upload;
};

const removeFile = (folder, fileName) => {
  if (fileName !== "" && typeof fileName !== "undefined") {
    const filePath = path.join(appRoot.path, "public", folder, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) throw err;
      });
    }
  }
};

module.exports = {
  upload: uploadFile,
  remove: removeFile,
};
