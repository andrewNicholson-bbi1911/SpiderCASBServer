const {UserManager, User} = require("../domain/models/user.js");
const {sessionController} = require("../domain/models/session.js");
const SecretTokenKey = require("../config").SecretTokenKey;
const jwt = require("jsonwebtoken");

const generateAccessToken = (user_id, user_name, permissions, session_id) => {
    const payload = {
        user_id: user_id,
        user_name: user_name,
        permissions: permissions,
        session_id: session_id
    }
    return jwt.sign(payload, SecretTokenKey, {expiresIn: "16h"});
}


class AuthController {
    async ping(req, res){
        try{
            const {message} = req.body;
            console.log("pinged");
            res.json({message: `pong! with message: ${message}`, body_of_request: req.body});
        }catch(e){
            console.log(e);
            return res.status(400).json({message: "Ping error"});
        }
    }

    async login(req, res){
        const logger = req.logger;//гарантирую, что логгер будет
        try{
            var {login, password} = req.body;
            var user;

            if(login && password){
                try{
                    user = await UserManager.get_user_by_login_and_password(login, password);
                }catch(e){
                    const message = `Wrong login or password for ${login} : ${password} : ${e}`;
                    logger.logError("LOGIN", message);
                    return res.status(401).json({message: "Wrong login or password"});
                }

                const session_id = sessionController.create_new_session(user.user_id);
                logger.initLogger(session_id, user.user_id);

                const token = generateAccessToken(
                    user.user_id, 
                    user.user_name, 
                    user.permissions,
                    session_id
                );
                res.json({
                    token : token, 
                    user_name : user.user_name, 
                    user_id : user.user_id
                });

                logger.log("LOGIN", `${login} sucessfuly loged in`);
            }else{
                throw new Error("wrong request");
            }
        }catch (e){
            logger.logError("LOGIN", e.message);
            return res.status(400).json({message: `Something went wrong with authorisation: ${e.message}`});
        }
    }

    async authenticate(req, res){
        const logger = req.logger;
        try{
            var {secret_key} = req.body;
            var {user_id, session_id} = req.user;

            var auth_successful = UserManager.try_update_user_authentification(user_id, session_id, secret_key);
            if(!auth_successful){
                const message = `Authentication error: wrong secret key`;
                logger.logError("AUTHENTICATION", message);
                return res.status(400).json({message: message});
            }

            const message = "Authentication successful";
            logger.log("AUTHENTICATION", message);
            res.json({message:message});
        }catch (e){
            logger.logError("AUTHENTICATION", e.message);
            return res.status(400).json({message: `Something went wrong during authentication: ${e.message}`});
        }
    }
}

module.exports = new AuthController();