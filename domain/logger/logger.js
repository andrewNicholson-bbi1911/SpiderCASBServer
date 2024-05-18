const FileManager = require("../models/other_models/fileData");

const BaseLogDir = require("../../config").RawLogsFolder;
const LogTypes = {
    CommonLog: "Common",
    ErrorLog: "Error"
};
const SystemID = "System";

class Log{
    constructor(user_id, type, time, method, message){
        this.user_id = user_id,
        this.type = type,
        this.time = time,
        this.method = method,
        this.message = message
    }
}

class SessionLogger{
    constructor(session_id, user_id){
        this.user_id = user_id??SystemID;
        if(!session_id){
            const date = new Date();
            session_id = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}_0_System`;
        }
        this.session_id = session_id;
        this.session_file_name = `${this.session_id}_log.log`;
    }

    initLogger(session_id ,user_id){
        this.session_id = session_id;
        this.user_id = user_id;
        this.session_file_name = `${this.session_id}_log.log`;
        FileManager.updateEntitySync(BaseLogDir,this.session_file_name, "");
        this.log("Inintialization", "Successful");
    }

    log(method, message){
        const log = new Log(
            this.user_id,
            LogTypes.CommonLog,
            Date.now(),
            method,
            message
        );
        this.writeLog(log);
    }

    logError(method, message){
        const log = new Log(
            this.user_id,
            LogTypes.ErrorLog,
            Date.now(),
            method,
            message
        );
        this.writeLog(log);
    }

    writeLog(log){
        console.log(`[${log.method}][${log.type}](user:${log.user_id})>>>${log.message}`);
        FileManager.appendStorageFileSync(BaseLogDir, this.session_file_name, JSON.stringify(log));
    }
}

//initializing system logger
const systemLogger = new SessionLogger();
systemLogger.initLogger(systemLogger.session_id, systemLogger.user_id);


module.exports = {
    Logger: SessionLogger,
    SystemLogger : systemLogger
}


