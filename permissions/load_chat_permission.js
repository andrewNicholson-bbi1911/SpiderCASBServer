const { ChatManager, SecretChatType} = require("../domain/models/chat");
const { UserManager} = require("../domain/models/user");

module.exports = function(user, req, res){
    const logger = req.logger;
    const {chat_id, chat_type} = req.query;
    const {user_id} = user;

    const chat = ChatManager.get_chat_by_ID(chat_id, chat_type);

    if(!chat || !chat.chat_users.includes(user_id)){
        logger.log("LOAD_CHAT_PERM", `user:${user_id} has no access to chat:${chat_id}`);
        return false
    }

    return true
}


