const { ChatManager, BaseChatType, SecretChatType} = require("../domain/models/chat");
const {UserChatData, User, UserManager} = require("../domain/models/user");

class ChatController{
    async get_all_user_chats(req, res){
        const logger = req.logger;

        try{
            const user_id = req.user.user_id;
            const user_chats = UserManager.get_chats_of_user_by_id(user_id);

            user_chats.forEach((chat) => {
                chat.last_message = ChatManager.get_last_message_of_chat(chat.chat_id, chat.chat_type);
            });

            user_chats.sort((a, b) => b.last_message.sending_time - a.last_message.sending_time);

            logger.log("GET_CHATS", `successfuly loaded ${user_chats.length} chats`);
            res.json({chats:user_chats});
        }catch (e){
            logger.logError("GET_CHATS", e.message);
            return res.status(400).json({message: "Chats Info loading error"});
        }
    }

    async load_chat(req, res){
        const logger = req.logger;

        try{
            const {chat_id, chat_type} = req.query;
            const {user_id, session_id} = req.user;

            const chat = ChatManager.get_chat_by_ID(chat_id, chat_type);
            
            if(chat.chat_type == SecretChatType && !UserManager.is_user_authentificated(session_id)){
                const message = "user is not authentificated";
                logger.logError("LOAD_CHAT", message);
                return res.status(440).json({message:message});
            }

            logger.log("LOAD_CHAT", `chat loaded:${chat_id}`);

            res.json({chat:chat});
        }catch (e){
            logger.logError("LOAD_CHAT", e.message);
            return res.status(400).json({message: "Something went wrong while loading a chat"});
        }
    }

    async send_message(req, res){
        const logger = req.logger;
        try{
            const {chat_id, chat_type} = req.query;
            const {message} = req.body;
            const {user_id, session_id} = req.user;
            const user_name = req.user.user_name;

            const chat = ChatManager.get_chat_by_ID(chat_id, chat_type);

            if(chat.chat_type == SecretChatType && !UserManager.is_user_authentificated(session_id)){
                const message = "user is not authentificated";
                logger.logError("SEND_MESSAGE", message);
                return res.status(440).json({message:message});
            }
            
            ChatManager.send_message_to_chat(chat, user_id, user_name, message);
            logger.log("SEND_MESSAGE", `message sent:${message}`)
            res.json({chat:chat});
        }catch (e){
            logger.logError("SEND_MESSAGE", e.message);
            return res.status(400).json({message: "Something went wrong while sending a message"});
        }
    }

}


module.exports = new ChatController();