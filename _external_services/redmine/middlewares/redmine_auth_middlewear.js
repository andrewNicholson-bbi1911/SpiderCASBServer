const {RedmineUserManager} = require("../domain/models/redmine_user.js");
const {SystemLogger} = require("../../../domain/logger/logger.js");

const UsersData = new Map();

module.exports = function (req, res, next){
    const logger = SystemLogger;

    try{
        const {user_id} = req.user;

        var user_auth_data;
        if(UsersData.has(user_id)){
            user_auth_data = UsersData.get(user_id);
            req.redmine_user = user_auth_data;

        }else{
            const user_auth_data = RedmineUserManager.get_user_data(user_id)
            req.redmine_user = user_auth_data;
            UsersData.set(user_id, user_auth_data);
            logger.log("REDMINE_AUTH_DATA", `Redmine auth data for user:${user_id} recieved`);
        }
        next();
    }catch(e){
        logger.logError("REDMINE_AUTH_DATA", e.message);
        return res.status(403).json({message: "user is not authorized, caught an error"});
    }
}