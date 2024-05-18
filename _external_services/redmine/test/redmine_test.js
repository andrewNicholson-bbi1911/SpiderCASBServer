const {RedmineAPI} = require("../domain/redmine_api/redmine_connector.js")

const Admin_testing_user_id = 1;

async function redmine_test_init(){

    //test getting issues for user
    if(true){
        console.log("Redmine_Test>>>start getting issues for user test");

        var res = await RedmineAPI.get_users_issues(Admin_testing_user_id);
        console.log(res);
        console.log("Redmine_Test>>>getting issues for user test complited");
    }

    //test updating status for user
    if(true){
        console.log("Redmine_Test>>>start updating issue status test");

        var res = await RedmineAPI.update_issue_status("casb_admin", "test_password", 1, 3);
        console.log(res);
        console.log("Redmine_Test>>>updating issue status test complited");
    }

    console.log("Redmine_Test>>>all redmine testes complited");
}

module.exports = {
    test: redmine_test_init()
};