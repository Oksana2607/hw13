const { MongoClient } = require('mongodb');
const Users = require('./Users.js');
const Messages = require('./Messages.js');

class Mongo {
    constructor() {
        const url = 'mongodb://localhost:27017/';

        this.client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});
    }
    async init() {
        await this.client.connect();
        this.db = this.client.db('chat');
        this.users = new Users(this.db);
        this.messages = new Messages(this.db);
    }
}

module.exports = new Mongo();
