const { ChatManager, BaseChatType, SecretChatType} = require("../domain/models/chat");
const { UserManager} = require("../domain/models/user");

const BaseChatChattingAlows = { 11: [1, 0] };
const SecretChatChattingAlows = { 1: [1] };

module.exports = function(user, req){
    const logger = req.logger;
    const {chat_id, chat_type} = req.query;
    const {user_id} = user;

    const chat = ChatManager.get_chat_by_ID(chat_id, chat_type);

    if(!chat || !chat.chat_users.includes(user_id)){
        logger.logError("SEND_MESSAGE_PERM", `wrong chat:${chat_id} loading`);
        return false
    }

    if(chat.chat_type == SecretChatType){
        if (SecretChatChattingAlows[chat_id] && !SecretChatChattingAlows[chat_id].includes(user_id)){
            logger.logError("SEND_MESSAGE_PERM", "user is not allowed to send messages in this chat");
            return false;
        }
    }else{
        if (BaseChatChattingAlows[chat_id] && !BaseChatChattingAlows[chat_id].includes(user_id)){
            logger.logError("SEND_MESSAGE_PERM", "user is not allowed to send messages in this chat");
            return false;
        }
    }

    return true
}




