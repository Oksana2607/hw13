const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
    message: {
        type: String
    },
    user: {
        type:  String
    },
    time: {
        type: Date
    }
},{
    collection: 'messages'
});

module.exports = mongoose.model('Message', Message);