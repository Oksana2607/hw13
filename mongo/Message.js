const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    text: {
        type: String
    },
    user: {
        type:  String
    },
    time: {
        type: Date
    },
    user_id: {
        type: String
    },
    receiver_id: {
        type: String
    }
},{
    collection: 'messages'
});

module.exports = mongoose.model('Message', Message);