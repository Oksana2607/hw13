class Messages {
    constructor(db) {
        this.collection = db.collection('messages');
    }

    async addMessage(message) {
        try {
            return await this.collection.insertOne(message);
        } catch (error) {
            throw new Error(error.message);
        }
    };

    async clearAllMessages() {
        this.collection.drop();
    };

}

module.exports = Messages;