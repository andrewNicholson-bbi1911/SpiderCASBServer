const path = require("path");
const TOKENKEY = "SECRET_TOKEN_gI>ssR=zw_";
const STORAGE_FOLDER = path.join(__dirname, "storage");
const RAW_BASE_CHATS_FOLDER = path.join("chats", "base");
const RAW_SECRET_CHATS_FOLDER = path.join("chats", "secret");
const RAW_USERS_FOLDER = path.join("users");
const RAW_USERS_AUTH_FOLDER = path.join("users", "auth");
const RAW_USERS_DATA_FOLDER = path.join("users", "data");
const RAW_LOGS_FOLDER = path.join("logs");


const DEFAULT_AUTHENTIFICATION_TIME_SECONDS = 15*60;

module.exports = {
    SecretTokenKey: TOKENKEY,
    StorageFolder: STORAGE_FOLDER,
    RawBaseChatsFolder: RAW_BASE_CHATS_FOLDER,
    RawSecretChatsFolder: RAW_SECRET_CHATS_FOLDER,
    RawUsersFolder: RAW_USERS_FOLDER,
    RawUsersAuthFolder: RAW_USERS_AUTH_FOLDER,
    RawUsersDataFolder: RAW_USERS_DATA_FOLDER,
    RawLogsFolder: RAW_LOGS_FOLDER,
    AuthentificationTime: DEFAULT_AUTHENTIFICATION_TIME_SECONDS,

}