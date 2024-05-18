const Router = require("express");
const router = new Router();

const authController = require("../controllers/auth_controller");
const authMiddlware = require("../middlewares/auth_middleware");
const loggerInitMiddleware = require("../middlewares/logger_init_middleware");

router.post("/login", loggerInitMiddleware, authController.login);
router.post("/authentication", authMiddlware, loggerInitMiddleware, authController.authenticate);

module.exports = router;