class Store {
    constructor() {
        this._user = {};
        this._allUsers = [];
        this._activeUsers = [];
        this._isActive = '';
        this._messages = [];
        this._receiver_id = '';
    }

    addUser(user) {
        this._user = user;
    }

    addUsers(users) {
        this._allUsers = users;
    }

    addMessage(message) {
        this._messages.push(message);
        return this._messages;
    }

    getUsers() {
        return this._allUsers;
    }

    addActiveUsers(users) {
        this._activeUsers = users;
    }

    getActiveUsers() {
        return this._activeUsers;
    }
}

