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
if(false){
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
if(false){
    external_services_tests.init_tests.then(
        () => {
            console.log("external services test complited");
        }
    );
}


if(true){
    const user_1 = UserManager.get_user_by_login_and_password("test_user_2", "password_2");
    const user_2 = UserManager.create_new_user("casb_coder_1", "Coder 1 (Front)", "coder_password_1", "1234");
    const user_3 = UserManager.create_new_user("casb_coder_2", "Coder 2 (Back)", "coder_password_2", "4321");
    const user_4 = UserManager.create_new_user("casb_designer_1", "Designer 1", "designer_password_1", "5678");
    const user_5 = UserManager.create_new_user("casb_analyst_1", "Analyst 1", "analyst_password_1", "9999");

    ChatManager.create_new_chat("Base", [1, 2, 3, 4, 5]);
    user_1.add_new_chat(6, "Base", "Общий чат разработки");
    user_2.add_new_chat(6, "Base", "Общий чат разработки");
    user_3.add_new_chat(6, "Base", "Общий чат разработки");
    user_4.add_new_chat(6, "Base", "Общий чат разработки");
    user_5.add_new_chat(6, "Base", "Общий чат разработки");

    ChatManager.create_new_chat("Secret", [1, 2]);
    user_1.add_new_chat(3, "Secret", "Чат c Coder_1");
    user_2.add_new_chat(3, "Secret", "Администратор");

    ChatManager.create_new_chat("Secret", [1, 3]);
    user_1.add_new_chat(4, "Secret", "Чат c Coder_2");
    user_3.add_new_chat(4, "Secret", "Администратор");

    ChatManager.create_new_chat("Secret", [1, 4]);
    user_1.add_new_chat(5, "Secret", "Чат c Designer_1");
    user_4.add_new_chat(5, "Secret", "Администратор");

    ChatManager.create_new_chat("Secret", [1, 5]);
    user_1.add_new_chat(6, "Secret", "Чат c Analyst_1");
    user_5.add_new_chat(6, "Secret", "Администратор");

    ChatManager.create_new_chat("Base", [1, 2, 3]);
    user_1.add_new_chat(7, "Base", "Чат кодеров");
    user_2.add_new_chat(7, "Base", "Чат кодеров");
    user_3.add_new_chat(7, "Base", "Чат кодеров");

    ChatManager.create_new_chat("Base", [2, 4]);
    user_2.add_new_chat(8, "Base", "Чат с дизайнером");
    user_4.add_new_chat(8, "Base", "Чат с мобильным разработчиком");

    ChatManager.create_new_chat("Base", [3, 5]);
    user_3.add_new_chat(9, "Base", "Чат с аналитиком");
    user_5.add_new_chat(9, "Base", "Чат с бек-разрабом");

    ChatManager.create_new_chat("Base", [4, 5]);
    user_4.add_new_chat(10, "Base", "Чат с аналитиком");
    user_5.add_new_chat(10, "Base", "Чат с дизайнером");

    ChatManager.create_new_chat("Base", [0, 1, 2, 3, 4, 5]);
    user_1.add_new_chat(11, "Base", "Новости");
    user_2.add_new_chat(11, "Base", "Новости )");
    user_3.add_new_chat(11, "Base", "Новости");
    user_4.add_new_chat(11, "Base", "Новости");
    user_5.add_new_chat(11, "Base", "Новости");
}