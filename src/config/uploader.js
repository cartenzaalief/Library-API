const multer = require("multer");
const fs = require("fs");

module.exports = {
  uploader: (directory, filePrefix) => {
    // Define default directory location
    let defaultDir = "./src/public";

    // Multer configuration
    const storageUploader = multer.diskStorage({
      destination: (req, file, cb) => {
        // Determine storage location
        const pathDir = directory ? defaultDir + directory : defaultDir;

        // pathDir checking
        if (fs.existsSync(pathDir)) {
          console.log(`Directory ${pathDir} exist`);
          cb(null, pathDir);
        } else {
          fs.mkdir(pathDir, { recursive: true }, (error) => {
            if (error) {
              console.log(`Error make directory`, error);
            }
            cb(error, pathDir);
          });
        }
      },
      filename: (req, file, cb) => {
        // Read extension
        let ext = file.originalname.split(".");
        console.log(ext);

        let newName = filePrefix + Date.now() + "." + ext[ext.length - 1];
        console.log(newName);
        cb(null, newName);
      },
    });

    return multer({
      storage: storageUploader,
      fileFilter: (req, file, cb) => {
        const extFilter = /\.(jpg|png|webp|doc|pdf)/;
        let check = file.originalname.toLocaleLowerCase().match(extFilter);
        if (check) {
          cb(null, true);
        } else {
          cb(new Error("Your file ext denied", false));
        }
      },
    });
  },
};
