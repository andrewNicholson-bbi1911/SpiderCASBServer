const config = require("../../config.js");
const FileManager = require("../models/other_models/fileData.js");
const {SystemLogger} = require("../logger/logger.js");
const BaseChatDir = config.RawBaseChatsFolder;
const SecretChatDir = config.RawSecretChatsFolder;

const SecretChatType = "Secret";
const BaseChatType = "Base";

class Message{
    constructor( sender_id, sender_name, sending_time, message){
        this.sender_id = sender_id;
        this.sender_name = sender_name;
        this.sending_time = sending_time;
        this.message = message;
    }

    static create_new_message(sender_id, sender_name, sending_time, message){
        return new Message(sender_id, sender_name, sending_time, message);
    }

    static create_message_from_json_obj(json_obj){
        if(!json_obj)
            json_obj = {};
        return new Message(
            json_obj.sender_id??-1,
            json_obj.sender_name??"Chat",
            json_obj.sending_time??0,
            json_obj.message??"empty message",
        );
    }

    clone(){
        return new Message(this.sender_id, this.sender_name, this.sending_time, this.message);
    }
}


class Chat{
    
    constructor(chat_id, chat_type, chat_users, messages_list, last_message){
        this.chat_id = chat_id;
        this.chat_type = chat_type;
        this.chat_users = chat_users;
        this.messages_list = messages_list;
        this.last_message = last_message??new Message(-1, "Chat", Date.now(), "new chat created" );
    }

    save_chat(){
        const object_str = JSON.stringify(this);
        FileManager.updateEntitySync(
            ChatManager.get_chat_type_dir(this.chat_type),
            `chat_${this.chat_id}.json`,
            object_str
        );
    }

    add_message(message){
        if(this.chat_users.includes( message.sender_id )){
            this.messages_list.push(message);
            this.last_message = message.clone();

            if(this.chat_type == SecretChatType){
                this.last_message.message = "* secret message *";
            }

            this.save_chat();
        }else{
            throw new Error("User is not at chat");
        }
    }

    add_user(user_id){
        if(!this.chat_users.includes( user_id )){
            this.chat_users.push(user_id);
            this.save_chat();
        }
    }

    static create_chat_from_json(json_str){
        const raw_obj = JSON.parse(json_str);
        const {chat_id, chat_type, chat_users, messages_list, last_message} = raw_obj;
        const list_of_masages = [];
        messages_list.forEach((raw_message) => list_of_masages.push(Message.create_message_from_json_obj(raw_message)));
        const last_chat_message = Message.create_message_from_json_obj(last_message);
        return new Chat(chat_id, chat_type, chat_users, messages_list, last_chat_message);
    }
}


class ChatManager{

    static create_new_chat(chat_type, chat_users){
        const dir_path = ChatManager.get_chat_type_dir(chat_type);
        const new_id = FileManager.getNextIdForEntityIn(dir_path);
        const new_chat = new Chat(new_id, chat_type, chat_users, []);
        new_chat.save_chat();

        return new_chat;
    }

    static get_chat_by_ID(chat_id, chat_type){
        try{
            const str = FileManager.readStrFileSync(
                ChatManager.get_chat_type_dir(chat_type),
                `chat_${chat_id}.json`,
            );
            //return JSON.parse(str);
            return Chat.create_chat_from_json(str);
        }catch(e){
            SystemLogger.logError("get_chat_by_ID",e.message);
            return undefined;
        }
    }

    static get_last_message_of_chat(chat_id, chat_type){
        try{
            const json_str = FileManager.readStrFileSync(
                ChatManager.get_chat_type_dir(chat_type),
                `chat_${chat_id}.json`,
            );
            //return JSON.parse(str);
            const last_msg = JSON.parse(json_str)["last_message"]?? Message.create_message_from_json_obj({});
            return last_msg;
        }catch(e){
            SystemLogger.logError("get_last_message_of_chat",e.message);
            return undefined;
        }
    }

    static send_message_to_chat(chat, user_id, user_name, message){
        chat.add_message(new Message(user_id, user_name, Date.now(), message));
    }

    static get_chat_type_dir(chat_type){
        return chat_type == SecretChatType ? SecretChatDir : BaseChatDir;
    }
}


module.exports = {
    Message,
    Chat,
    ChatManager,
    SecretChatType,
    BaseChatType
}