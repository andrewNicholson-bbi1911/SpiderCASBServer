//const db = require("../db/db_controller").defaultDB;
const { threadId } = require("worker_threads");
const config = require("../../redmine_config");
const FileManager = require("./other_models/fileData.js");
const { forEach } = require("jszip");

const UsersListFileName = "redmine_users.json";
const BaseUsersDir = config.RawUsersFolder;


class RedmineUser{
    constructor(user_id, redmine_user_id,redmine_user_login, redmine_user_password){
        this.user_id = user_id;
        this.redmine_user_id = redmine_user_id;
        this.redmine_user_login = redmine_user_login;
        this.redmine_user_password = redmine_user_password;
    }

    static get_user_from_json_obj(json_obj){
        return new RedmineUser(
            json_obj.user_id,
            json_obj.redmine_user_id,
            json_obj.redmine_user_login,
            json_obj.redmine_user_password
            );
    }
}



class RedmineUserManager{
    static get_user_data(user_id){
        const user_json_obj = JSON.parse(FileManager.readStrFileSync(BaseUsersDir, `user_${user_id}.json`));
        return RedmineUser.get_user_from_json_obj(user_json_obj);
    }
}



module.exports = {
    RedmineUserManager,
    RedmineUser
}