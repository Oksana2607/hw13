const express = require('express');
const UserRoute = express.Router();

const User = require('./User');

UserRoute.route('/signIn').post((req, res) => {
    if (!req.body) {
        return res.sendStatus(400);
    }

    const user = new User(req.body);
    console.log(user);
    user.save()
        .then(user => {
            res.json('User added successfully');
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

module.exports = UserRoute;