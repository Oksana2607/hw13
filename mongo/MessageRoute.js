const express = require('express');
const MessageRoute = express.Router();

const Message = require('./Message');

MessageRoute.route('/message').post((req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }
    console.log(req.body);

    const message = new Message(req.body);

    message.save()
        .then(message => {
            res.json(message);
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

MessageRoute.route('/getMessages').get((req, res) => {

    Message.find().then(function (doc) {
        if (doc) {
            res.json(doc);
        } else {
            res.sendStatus(401);
        }
        console.log('find', doc);
    });
});

module.exports = MessageRoute;