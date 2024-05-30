const dotenv = require("dotenv");

console.log("==================")
dotenv.config();
var PORT = process.env.PORT || 8080;
//console.log(PORT);
console.log(process.env.NODE_ENV);
console.log("==================")

const {SystemLogger} = require("./domain/logger/logger");

const express = require("express");


//start export routers
const ping_router = require("./routers/ping_router.js");
const auth_router = require("./routers/auth_router.js");
const chat_router = require("./routers/chat_router.js");
//finish export routers

var app = express();

app.use(express.json());

//initializing routers
app.use("/api", ping_router);
app.use("/api/auth", auth_router);
app.use("/api/chat", chat_router);
//finish initing routers

//initializing external services api
const services_api_initialize = require("./_external_services/services_api_connect.js");
services_api_initialize(app);
//finish initializing external services api


app.listen(PORT,  () => {
    SystemLogger.log("SERVER_INITIALIZATION", `SERVER STARTED AT PORT: ${PORT}`);
})