class Store {
    constructor() {
        // this._user = {};
        this._allUsers = [];
        this._activeUsers = [];
        this._isActive = '';
        this._messages = [];
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

    addActiveUser(user) {
        this._activeUsers.push(user);
    }

    getActiveUsers() {
        return this._activeUsers;
    }
}