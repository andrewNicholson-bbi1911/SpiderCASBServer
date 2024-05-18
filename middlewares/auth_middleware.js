const jwt = require("jsonwebtoken");
const SecretTokenKey = require("../config").SecretTokenKey;
const SessionController = require("../domain/models/session").sessionController;
const SystemLogger = require("../domain/logger/logger").SystemLogger;

module.exports = function (req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            const message = "user is not authorized";
            SystemLogger.log("AUTH_MW", message)
            return res.status(401).json({message: message});
        }
        const decodedData = jwt.verify(token, SecretTokenKey);

        if(!SessionController.session_exists(decodedData.session_id)){
            const message = "user session is expired";
            SystemLogger.log("AUTH_MW", message)
            return res.status(401).json({message: message});
        }

        req.user = decodedData;
        next();

    }catch(e){
        console.log(e);
        return res.status(400).json({message: "user is not authorized or authoriswed incorrectly"});
    }
}