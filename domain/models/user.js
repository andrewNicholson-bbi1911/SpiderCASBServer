//const db = require("../db/db_controller").defaultDB;
const { threadId } = require("worker_threads");
const SessionController = require("./session").sessionController;
const config = require("../../config");
const FileManager = require("../models/other_models/fileData.js");

const UsersListFileName = "users.json";
const BaseUsersDir = config.RawUsersFolder;
const BaseUsersAuthDir = config.RawUsersAuthFolder;
const BaseUsersDataDir = config.RawUsersDataFolder;
const AuthTime = config.AuthentificationTime;

class UserChatData{
    constructor(chat_id, chat_type, chat_label){
        this.chat_id = chat_id;
        this.chat_type = chat_type;
        this.chat_label = chat_label;
        this.last_message = null;
    }
}


class UserAuthData{
    constructor(user_id, user_login, user_password, last_time_password_changed, user_secret_key, last_time_secret_key_changed){
        this.user_id = user_id;
        this.user_login = user_login;
        this.user_password = user_password;
        this.last_time_password_changed = last_time_password_changed;
        this.user_secret_key = user_secret_key;
        this.last_time_secret_key_changed = last_time_secret_key_changed;
    }

    update_password(new_password){
        this.user_password = new_password;
        this.last_time_password_changed = Date.now();
        this.save_user_auth_data();
    }

    try_authentificate(secret_key){
        return secret_key == this.user_secret_key;
    }

    update_secret_key(new_secret_key){
        this.user_secret_key = new_secret_key;
        this.last_time_secret_key_changed = Date.now();
        this.save_user_auth_data();
    }

    save_user_auth_data(){
        var object_str = JSON.stringify(this);
        FileManager.updateEntitySync(
            config.RawUsersAuthFolder,
            `auth_user_${this.user_id}.json`,
            object_str
        );
    }

    static get_auth_data_from_json_obj(json_obj){
        return new UserAuthData(
            json_obj.user_id,
            json_obj.user_login,
            json_obj.user_password,
            json_obj.last_time_password_changed,
            json_obj.user_secret_key,
            json_obj.last_time_secret_key_changed
        )
    }
}


class User{
    constructor(user_id, user_name, permissions, joined_chats){
        this.user_id = user_id;
        this.user_name = user_name;
        this.permissions = permissions;
        this.joined_chats = joined_chats;
    }

    save_user(){
        const object_str = JSON.stringify(this);
        FileManager.updateEntitySync(
            config.RawUsersDataFolder,
            `user_${this.user_id}.json`,
            object_str
        );
    }
    
    add_new_chat(chat_id, chat_type, chat_label){
        const newChat = new UserChatData(chat_id, chat_type, chat_label);
        this.joined_chats.push(newChat);
        this.save_user();
    }

    static get_user_from_json_obj(json_obj){
        var chat_list = [];
        json_obj.joined_chats.forEach(
            (chat_obj) => chat_list.push(
                    new UserChatData(chat_obj.chat_id, chat_obj.chat_type, chat_obj.chat_label)
                ));
        
        return new User(
            json_obj.user_id,
            json_obj.user_name,
            json_obj.permissions,
            chat_list
            );
    }
}



class UserManager{
    static create_new_user(user_login, user_name, user_password, user_secret_key){
        var users = UserManager.get_users_list();

        var id = 0;
        if(users.length > 0){
            id = (users[users.length-1].id ?? -1) + 1;

            if(users.find((elem) => elem.user_login == user_login)){
                throw new Error(`login ${user_login} is busy`);
            }
        }

        users.push({id:id, user_login: user_login});
        UserManager.update_users_list(users);

        const new_user = new User(id, user_name, [], []);
        const new_user_auth_data = new UserAuthData(id, user_login, user_password, Date.now(), user_secret_key,  Date.now(), 0);
        new_user.save_user();
        new_user_auth_data.save_user_auth_data();

        return new_user;
    }

    static get_user_by_login_and_password(user_login, user_password){
        var users = UserManager.get_users_list();
        const related_user = users.find((user) => user.user_login == user_login);
        if(related_user){
            const auth_data = UserManager.get_auth_data(related_user.id);
            if(auth_data.user_password == user_password){
                const user_json_obj = JSON.parse(FileManager.readStrFileSync(BaseUsersDataDir, `user_${related_user.id}.json`));
                return User.get_user_from_json_obj(user_json_obj);
            }else{
                throw new Error("wrong password");
            }
        }
        else{
            throw new Error("wrong login");
        }
    }

    static update_user_password(user, old_password, new_password){
        const auth_data = UserManager.get_auth_data(user.user_id);

        if(auth_data.user_password == old_password && old_password != new_password){
            auth_data.update_password(new_password);
        }else{
            throw new Error("wrong email or new email is the same as old");
        }
    }

    static is_user_authentificated(session_id){
        return Math.round((Date.now() - SessionController.get_session_last_auth_time(session_id))/1000) < AuthTime;
    }

    static try_update_user_authentification(user_id, session_id, user_secret_key){
        const auth_data = UserManager.get_auth_data(user_id);
        if(auth_data.try_authentificate(user_secret_key)){
            SessionController.update_session_auth_time(session_id);
            return true;
        }else{
            SessionController.update_session_auth_time(session_id, 0);
            return false;
        }
    }

    static update_user_secret_key(user, old_secret_key, new_secret_key){
        const auth_data = UserManager.get_auth_data(user.user_id);
        if(auth_data.user_secret_key == old_secret_key && old_secret_key != new_secret_key){
            auth_data.update_secret_key(new_secret_key);
        }else{
            throw new Error("wrong secret key or new key is the same as old");
        }
    }

    static get_chats_of_user_by_id(user_id){
        var user = UserManager.get_user_data(user_id);
        return user.joined_chats;
    }


    static get_auth_data(user_id){
        const auth_json_obj = JSON.parse(FileManager.readStrFileSync(BaseUsersAuthDir, `auth_user_${user_id}.json`));
        return UserAuthData.get_auth_data_from_json_obj(auth_json_obj);
    }

    static get_user_data(user_id){
        const user_json_obj = JSON.parse(FileManager.readStrFileSync(BaseUsersDataDir, `user_${user_id}.json`));
        return User.get_user_from_json_obj(user_json_obj);
    }

    /*
    static async get_auth_data_async(user_id){
        const auth_json_obj = await JSON.parse(FileManager.readStrFileAsync(BaseUsersAuthDir, `auth_user_${user_id}.json`));
        return UserAuthData.get_auth_data_from_json_obj(auth_json_obj);
    }
    */

    static get_users_list(){
        return JSON.parse(FileManager.readStrFileSync(BaseUsersDir, UsersListFileName)).users;
    }

    static update_users_list(users_list){
        FileManager.updateEntitySync(BaseUsersDir, UsersListFileName, JSON.stringify({users:users_list}));
    }
}



module.exports = {
    UserManager,
    UserChatData,
    User
}