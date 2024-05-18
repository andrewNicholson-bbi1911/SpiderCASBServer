const { url } = require("inspector");
const RedmineURL = "http://89-111-131-74.swtest.ru";
const IssuesAPI = "issues"


class RedmineAPI{
    static async get_users_issues(redmine_user_id){
        const url = urlJoin([RedmineURL, `${IssuesAPI}.json?assigned_to_id=${redmine_user_id}`]);
        const response = await fetch(url);

        const res = {
            status: response.status,
            data: await response.json()
        }

        return res;
    }

    static async get_issue_data(issue_id){
        const url = urlJoin([RedmineURL, IssuesAPI, `${issue_id}.json`]);
        const response = await fetch(url);

        const res = {
            status: response.status,
            data: await response.json()
        }

        return res;
    }

    static async update_issue_status(redmine_login, redmine_password, issue_id, new_status_id){
        const url = urlJoin([RedmineURL, IssuesAPI, `${issue_id}.json`]);
        const authStr = Buffer.from(redmine_login+":"+redmine_password).toString('base64');
        const response = await fetch(url,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Basic " + authStr
              },
            body:JSON.stringify({
                issue:{
                    status_id: new_status_id
                }
            })
        });

        const res = {
            status: response.status,
        }
        
        return res;
    }
}

function urlJoin(parts){
    var url = parts[0];
    var index = 0
    parts.forEach((part) => {
        if(index != 0){
            url += `/${part}`;
        }
        index += 1;
    });
    return url;
}

module.exports = {RedmineAPI};