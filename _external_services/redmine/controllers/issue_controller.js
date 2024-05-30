const {RedmineAPI} = require("../domain/redmine_api/redmine_connector.js");


class IssueController {
    //issue_id
    async get_issues(req, res){
        const logger = req.logger;

        try{
            const {redmine_user_id} = req.redmine_user;
            
            var result = await RedmineAPI.get_users_issues(redmine_user_id);

            if(result.status >= 200 && result.status <= 299){
                logger.log("REDMINE_GET_ISSUES", `recieved ${result.data.total_count}`);
                res.json(result.data);
            }else{
                logger.logError("REDMINE_GET_ISSUES", `recieving message returns code: ${result.status}`);
                return res.status(result.status).json({message: "something went wrong while getting issues"});
            }
        }catch(e){
            logger.logError("REDMINE_GET_ISSUES", e.message);
            return res.status(400).json({message: "Getting issues error"});
        }
    }

    async get_issue_data(req, res){
        const logger = req.logger;

        try{
            const {issue_id} = req.query;

            var result = await RedmineAPI.get_issue_data(issue_id);
            
            if(result.status >= 200 && result.status <= 299){
                logger.log("REDMINE_GET_ISSUE_DATA", `loaded data for issue:${issue_id}`);
                res.json(result.data);
            }else{
                logger.logError("REDMINE_GET_ISSUE_DATA", `loading issue error:${result.status}`);
                return res.status(result.status).json({message: "something went wrong while getting issues"});
            }
        }catch(e){
            logger.logError("REDMINE_GET_ISSUE_DATA", e.message);
            return res.status(400).json({message: "Getting issues error"});
        }
    }

    async update_issue_status(req, res){
        const logger = req.logger;

        try{
            const {redmine_user_login, redmine_user_password} = req.redmine_user;
            const {issue_id} = req.query;
            const {new_issue_status} = req.body;

            var result = await RedmineAPI.update_issue_status(redmine_user_login, redmine_user_password, issue_id, new_issue_status);

            if(result.status >= 200 && result.status <= 299){
                logger.log("REDMINE_UPDATE_ISSUE_STATUS", `issue:${issue_id} status:${new_issue_status} updated`);
                res.json({message: "successful", data: result.data});
            }else{
                logger.logError("REDMINE_UPDATE_ISSUE_STATUS", `updating:${issue_id} issue status error`);
                return res.status(result.status).json({message: "something went wrong while getting issues"});
            }
        }catch(e){
            logger.logError("REDMINE_UPDATE_ISSUE_STATUS", e.message);
            return res.status(400).json({message: "Getting issues error"});
        }
    }
}

module.exports = new IssueController();