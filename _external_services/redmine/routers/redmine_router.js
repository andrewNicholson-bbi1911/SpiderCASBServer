const Router = require("express");
const router = new Router();
const SystemAuthMiddleware = require("../redmine_config").SystemAuthMiddleware;
const SystemInitLoggerMiddleware = require("../redmine_config").SystemInitLoggerMiddleware;

const issueController = require("../controllers/issue_controller");
const redmineAuthMiddleware = require("../middlewares/redmine_auth_middlewear");


router.get("/issues", SystemAuthMiddleware, SystemInitLoggerMiddleware, redmineAuthMiddleware, issueController.get_issues );
router.get("/issues/data", SystemAuthMiddleware, SystemInitLoggerMiddleware, redmineAuthMiddleware, issueController.get_issue_data);
router.put("/issues/update_status", SystemAuthMiddleware, SystemInitLoggerMiddleware, redmineAuthMiddleware, issueController.update_issue_status);

module.exports = router;