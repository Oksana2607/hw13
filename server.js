//npm install
//npm install express
// npm install pg
//npm install fs
//npm install body-parser

const express = require('express');
const app = express();
const server_port = process.env.YOUR_PORT || process.env.PORT || 80;
const server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function () {
    console.log('Listening on port %d', server_port);
});

//body parser
const bodyParser = require('body-parser');
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

const postDB = require('./public/js/modelPost');

app.post("/signIn", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let newUser = JSON.parse(req.body.newUser);
    postDB.createUser(newUser);
    res.status(200).send('json done');
});

app.post("/signUp", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let UserAuth = JSON.parse(req.body.UserAuth);
    postDB.loginUser(UserAuth);
    res.status(200).send('json done');
});
