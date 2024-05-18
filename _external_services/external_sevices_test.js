const redmine_test = require("./redmine/test/redmine_test.js")

async function init_test(){
    await redmine_test.test;
}

module.exports = {
    init_tests: init_test()
}