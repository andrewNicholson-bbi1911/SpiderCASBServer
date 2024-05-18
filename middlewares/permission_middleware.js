const jwt = require("jsonwebtoken");
const SecretTokenKey = require("../config").SecretTokenKey;
const SessionController = require("../domain/models/session").sessionController;
const SystemLogger = require("../domain/logger/logger").SystemLogger;

module.exports = (permission_settings) => function (req, res, next){
    const logger = req.logger;
    try{
        if(!permission_settings || permission_settings(req.user, req, res)){
            next();
        }else{
            const message = "Access denied";
            logger.logError("PERMISSION_VALIDATION", message);
            return res.status(403).json({message: message});
        }
    }catch(e){
        logger.logError("PERMISSION_VALIDATION", e.message);
        return res.status(400).json({message: "incorrect permissions initialization"});
    }
}