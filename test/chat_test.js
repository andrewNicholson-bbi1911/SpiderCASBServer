const dotenv = require("dotenv");

console.log("==================")
dotenv.config();
console.log(process.env.NODE_ENV);
console.log(process.env.PORT);
console.log("==================")

const {ChatManager, Chat, Message} = require("../domain/models/chat");
const {UserManager, User} = require("../domain/models/user");
const external_services_tests = require("../_external_services/external_sevices_test.js");

//testing CASB functions
if(true){
    var test_user_1;
    var test_user_1_login = "test_user_1";
    var test_user_2;
    var test_user_2_login = "test_user_2";

    // testing user registration
    if(false){
        const new_user_1 = UserManager.create_new_user(test_user_1_login, "Admin 1", "password_1", "1111");
        const new_user_2 = UserManager.create_new_user(test_user_2_login, "Admin 2", "password_2", "2222");
        console.log("Test>>> user registration complited");
    }

    // testing user authorisation
    if(false){
        test_user_1 = UserManager.get_user_by_login_and_password(test_user_1_login, "password_1");
        test_user_2 = UserManager.get_user_by_login_and_password(test_user_2_login, "password_2");
        console.log("Test>>> user authorisation complited");
    }

    // testing password update
    if(false){
        try{
            UserManager.update_user_password(test_user_1, "wrong password", "new password_1");
        }catch(e){
            console.log("Test>>> wrong password test complited");
        }
        UserManager.update_user_password(test_user_1, "password_1", "new password_1");
        console.log("Test>>>password update test complited");
    }

    // testing secret key update
    if(false){
        try{
            UserManager.update_user_secret_key(test_user_2, "eeee", "3333");
        }catch(e){
            console.log("Test>>> wrong secret key test complited");
        }
        UserManager.update_user_secret_key(test_user_2, "2222", "3333");
        console.log("Test>>>secret key update test complited");
    }

    var base_chat_1;
    //testing registering new chat
    if(false){
        const new_chat = ChatManager.create_new_chat("Base", [test_user_1.user_id]);
        test_user_1.add_new_chat(new_chat.chat_id, new_chat.chat_type, "new chat");

        const first_message = new Message(
            test_user_1.user_id,
            test_user_1.user_name,
            Date.now(),
            "Hey sombody!" );
        new_chat.add_message(first_message);

        base_chat_1 = new_chat;
        console.log("Test>>>chat registration complited");
    }

    //testing adding new member to chat
    if(false){
        base_chat_1.add_user(test_user_2.user_id);
        test_user_2.add_new_chat(base_chat_1.chat_id, base_chat_1.chat_type, "new chat");

        const new_message = new Message(
            test_user_2.user_id,
            test_user_2.user_name,
            Date.now(),
            "Hey everybody!" );
        base_chat_1.add_message(new_message);

        console.log("Test>>>adding new member to chat complited");
    }
}

//testing external modules
if(true){
    external_services_tests.init_tests.then(
        () => {
            console.log("external services test complited");
        }
    );
}
