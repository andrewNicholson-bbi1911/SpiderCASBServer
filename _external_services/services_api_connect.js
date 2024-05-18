const redmineRouter = require("./redmine/routers/redmine_router");

module.exports = function init_servicess_api(app){
    app.use("/api/redmine", redmineRouter);
}