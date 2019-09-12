const express = require('express');
const UserRoute = express.Router();

const User = require('./User');

UserRoute.route('/signIn').post((req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }
    console.log(req.body);

    const newUser = {
        ...req.body,
        isActive: true
    };

    const user = new User(newUser);

    user.save()
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

UserRoute.route('/login').post((req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const {email, password} = req.body;

    User.findOneAndUpdate({email: email}, {isActive: true}).then(function (doc) {
        if (doc) {
            res.json(doc);
        } else {
            res.sendStatus(401);
        }
        console.log('findOne', doc);
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
        console.log('findOneAndUpdate', doc);
    });
});


UserRoute.route('/getUsers').get((req, res) => {

    User.find({isActive: true}).then(function (doc) {
        if (doc) {
            res.json(doc);
        } else {
            res.sendStatus(401);
        }
        console.log('find', doc);
    });


});

module.exports = UserRoute;