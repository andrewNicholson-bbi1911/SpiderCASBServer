const Router = require("express");
const router = new Router();

const chat_controller = require("../controllers/chat_controller.js");
const auth_middleware = require("../middlewares/auth_middleware.js");
const permissions_middleware = require("../middlewares/permission_middleware.js");
const logger_init_middleware = require("../middlewares/logger_init_middleware");

const load_chat_permission_settings = require("../permissions/load_chat_permission.js");
const send_message_permission_settings = require("../permissions/send_message_permission.js");

router.get("/all", auth_middleware, logger_init_middleware, chat_controller.get_all_user_chats);
router.get("/chat_data", auth_middleware, logger_init_middleware, permissions_middleware(load_chat_permission_settings), chat_controller.load_chat);
router.post("/send_message", auth_middleware, logger_init_middleware, permissions_middleware(send_message_permission_settings), chat_controller.send_message);

module.exports = router;


