const express = require('express');
const WebSocket = require('ws');
const app = express();
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log('Listening on port %d', PORT);
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
const usersPost = require('./postgre/Users');
const messagePost = require('./postgre/Messages');

//POST

app.post("/signInUser", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let newUser = JSON.parse(req.body.newUser);
    usersPost.createUser(newUser, res);
});

app.post("/signUpUser", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    let UserAuth = JSON.parse(req.body.UserAuth);
    usersPost.loginUser(UserAuth, res);
});

app.post("/user/getUsers", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    usersPost.getAllUsers(res);
});

// app.post("/getActiveUsers", function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//     let UserAuth = JSON.parse(req.body.UserAuth);
//     usersPost.loginUser(UserAuth, res);
// });


// init WS
const server = new WebSocket.Server({port: 4000}, () => {
    console.log('WS server started on port 4000');
});

const handleMessage = (message, ws) => {
    const data = JSON.parse(message);

    const time = new Date();

    switch (data.type) {
        case "USER_MESSAGE":
            server.broadcast(JSON.stringify({...data, time: time}), ws);
            // console.log({...data, time: time});
            messagePost.addMessage({...data});
            // const message = new Message({...data});
            // console.log(...data);
            // message.save();
            break;
        case "CLOSE":
            server.broadcast(JSON.stringify({...data, time: time}), ws);
            break;
        default:
            return;
    }
};

// const handleOnConnect = ws => {
//     Message.find().sort({'time': -1}).limit(5).then(function (doc) {
//         if (doc) {
//             doc.forEach(message => {
//                 ws.send(JSON.stringify(message));
//             });
//         }
//     });
// };

// Broadcast to all
server.broadcast = (data, ws) => {
    server.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(data);
        }
    });
};

// ws server
server.on('connection', ws => {
    ws.send(JSON.stringify({
        type: 'SERVER_MESSAGE',
        text: 'Welcome!',
        time: new Date()
    }));

    messagePost.handleOnConnect(ws);

    ws.on('message', message => {
        handleMessage(message, ws);
    });

    ws.on('close', () => {
        const message = JSON.stringify({
            type: 'CLOSE',
            text: `By!`,
            time: new Date()
        });

        handleMessage(message, ws);
    });
});