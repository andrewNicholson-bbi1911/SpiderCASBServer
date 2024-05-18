const Logger = require("../domain/logger/logger").Logger;
const SystemLogger = require("../domain/logger/logger").SystemLogger;


module.exports = function (req, res, next){
    try{
        if(req.user){
            const {session_id, user_id} = req.user;//точно будут, если использовать после auth_mw
            const logger = new Logger(session_id, user_id);
            req.logger = logger;
        }else{
            const logger = new Logger();
            req.logger = logger;
        }
        next();
    }catch(e){
        SystemLogger.logError("LOGGER_INIT_MW", e.message);
        return res.status(400).json({message: "provided request data is incorrect"});
    }
}