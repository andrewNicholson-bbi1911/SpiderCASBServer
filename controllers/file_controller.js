const config = require("../config");
const path = require("path");
const fs = require("fs");
//const UserManager = require("../domain/models/user");
const FileCreator = require("../domain/models/other_models/fileData");
const Cartoonizer = require("../cartoonizer");

const DEFAULT_AVATAR_LINK = config.DefultAvatarLink;

const RawImagesFolder = config.RawImagesFolder;
const CartoonIconsFolder = config.CartoonIconsFolder;
const AudioFolder = config.AudioFolder;

class FileController{
    async downloadFile(req, res){
        try{
            const logger = req.logger;
            const {link} = req.body;
            const fullPath = FileCreator.getFullFilePath(link);

            if(await fs.existsSync(fullPath)){
                return res.download(fullPath);
            }else{
                logger.logError(req.method, e.message);
                return res.status(400).json({message: "file not found"});
            }

            return res.download(fullPath);
        }catch(e){
            req.logger.logError(req.method, e.message);
            return res.status(500).json({ status: "error", message: e });
        }
    }

}

module.exports = new FileController();