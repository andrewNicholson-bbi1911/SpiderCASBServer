class SessionData{
    constructor(session_id, last_auth_time){
        this.session_id = session_id;
        this.last_auth_time = last_auth_time??0;
    }
}

class SessionController{

    constructor(){
        this._next_session_index = 0;
        this._sessions = {};
    }


    create_new_session(user_id){
        const new_session_id = this._get_next_session_id(user_id);
        const newSession = new SessionData(new_session_id);
        this._sessions[new_session_id] = newSession;
        return new_session_id;
    }

    session_exists(session_id){
        return session_id in this._sessions;
    }

    get_session_last_auth_time(session_id){
        return this._sessions[session_id].last_auth_time;
    }

    update_session_auth_time(session_id, value){
        this._sessions[session_id].last_auth_time = value??Date.now();
    }



    _get_next_session_id(user_id){
        const date = new Date();
        const session_id = `${date.getFullYear()}_`+
            `${date.getMonth()}_${date.getDate()}_`+
            `${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_`+
            `${date.getMilliseconds()}_user:${user_id}_${this._next_session_index}`;
        this._next_session_id += 1;
        return session_id;
    }
}

const sessionController = new SessionController();

module.exports = {
    sessionController: sessionController
}