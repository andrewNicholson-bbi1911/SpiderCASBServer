const path = require("path");
const STORAGE_FOLDER = path.join(__dirname, "storage");
const RAW_USERS_FOLDER = path.join("users");

const SYSTEM_AUTH_MIDDLEWARE = require("../../middlewares/auth_middleware");
const SYSTEM_INIT_LOGGER_MIDDLEWARE = require("../../middlewares/logger_init_middleware");

module.exports = {
    StorageFolder: STORAGE_FOLDER,
    RawUsersFolder: RAW_USERS_FOLDER,
    SystemAuthMiddleware: SYSTEM_AUTH_MIDDLEWARE,
    SystemInitLoggerMiddleware: SYSTEM_INIT_LOGGER_MIDDLEWARE
}