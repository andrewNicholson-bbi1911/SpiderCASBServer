const Router = require("express");
const router = new Router();

const authController = require("../controllers/auth_controller");

router.get("/ping", authController.ping);

module.exports = router;