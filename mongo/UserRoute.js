const express = require('express');
const UserRoute = express.Router();

const User = require('./User');

UserRoute.route('/signIn').post((req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const newUser = {
        ...req.body,
        isActive: true
    };

    const user = new User(newUser);

    const {email, password} = req.body;


    User.findOne({email: email, password: password}).then(function (doc) {
        if (doc) {
            res.sendStatus(401);
        } else {
            user.save()
                .then(user => {
                    res.json(user);
                })
                .catch(err => {
                    res.status(400).send("unable to save to database");
                });
        }
    });
});

UserRoute.route('/login').post((req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const {email, password} = req.body;

    User.findOneAndUpdate({email: email, password: password}, {isActive: true}).then(function (doc) {
        if (doc) {
            res.json(doc);
        } else {
            res.sendStatus(401);
        }
    });
});

UserRoute.route('/logout').post((req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const {id} = req.body;

    User.findOneAndUpdate({_id: id}, {isActive: false}).then(function (doc) {
        if (doc) {
            res.json(doc);
        } else {
            res.sendStatus(401);
        }
    });
});


UserRoute.route('/getActiveUsers').get((req, res) => {

    User.find({isActive: true}).then(function (doc) {
        if (doc) {
            res.json(doc);
        } else {
            res.sendStatus(401);
        }
    });
});

UserRoute.route('/getUsers').get((req, res) => {
    User.find().then(function (doc) {
        if (doc) {
            res.json(doc);
        } else {
            res.sendStatus(401);
        }
    });
});

module.exports = UserRoute;