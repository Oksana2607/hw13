// const socket = require('socket.io');
// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const constants = require('./constants');
// const ChatDAL = require('./dal/chatDAL');
// const PORT = process.env.PORT || 80;
// //body parser
// app.use(
//     bodyParser.urlencoded({
//         extended: true
//     })
// );
// app.use(bodyParser.json());
// app.use(express.static(__dirname + "/public"));
// app.use(express.static('public'));
// app.use(express.json());
//
// const server = app.listen(PORT, () => {
//     console.log('Listening on port %d', PORT);
// });
// const io = socket(server);
//
// const chatDal = new ChatDAL();
// chatDal.initialize();
//
// let users = {};
//
// io.sockets.on(constants.CONNECTION, function(socket){
//     socket.on(constants.MESSAGE, handleMessage);
//
//     socket.on(constants.ONLINE, idUser => {
//         let idOnline = [];
//
//         if (idUser) {
//             users[socket.id] = idUser;
//         }
//
//         for (let key in users) {
//             idOnline.push(users[key]);
//         }
//
//         io.sockets.emit(constants.ONLINE, idOnline);
//     });
//
//     socket.on(constants.DISCONNECT, () => {
//         io.sockets.emit(constants.OFFLINE, users[socket.id]);
//         delete users[socket.id];
//     });
// });
//
// async function handleMessage(message) {
//     await chatDal.createMessage(message);
//     const user = await chatDal.readUserToId(message.sender);
//
//     const oneMessage = {
//         message: message.message,
//         date: message.date,
//         name: user[0].name,
//         email: user[0].email
//     };
//
//     io.sockets.emit(constants.MESSAGE, oneMessage);
// }
//
// app.post('/message', async (request, res) => {
//     await chatDal.createMessage(request.body);
//     io.sockets.emit(constants.MESSAGE, request.body);
//
//     res.status(200).send('OK');
// });
//
// app.post('/auth', async (request, res) => {
//     try {
//         const { email, password } = JSON.parse(request.body.user);
//         const user = await chatDal.readUser(email, password);
//         res.status(200).send(user);
//     } catch (e) {
//         console.log(e.message, 2);
//         res.status(403).send(e.message);
//     }
// });
//
// app.post('/signInUser', async (request, res) => {
//     try {
//         await chatDal.createUser(JSON.parse(request.body.user));
//         res.status(200).send('OK');
//     } catch (e) {
//         res.status(409).send(e.message);
//     }
// });
//
// app.get('/users', async (request, res) => {
//     const users = await chatDal.readAllUsers();
//
//     res.status(200).send(users);
// });
//
// app.get('/messages', async (request, res) => {
//     const {sender, receiver, chat} = request.query;
//     let users = await  chatDal.readAllUsers();
//     let messages = [];
//
//     if (chat === 'PUBLIC') {
//         messages = await chatDal.readPublicMessages();
//     } else if (chat === "PRIVATE"){
//         messages = await chatDal.readPrivateMessages(sender, receiver);
//     }
//
//     res.status(200).send(chatDal.mergeMessageAndUser(messages, users));
// });


const express = require('express');
const WebSocket = require('ws');
const app = express();
const bodyParser = require('body-parser');
const constants = require('./constants');
const ChatDAL = require('./dal/chatDAL');
const PORT = process.env.PORT || 80;
//body parser
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static('public'));
app.use(express.json());

app.listen(PORT, () => {
    console.log('Listening on port %d', PORT);
});

const chatDal = new ChatDAL();
chatDal.initialize();

app.post('/auth', async (request, res) => {
    try {
        const { email, password } = JSON.parse(request.body.user);
        const user = await chatDal.readUser(email, password);
        res.status(200).send(user);
    } catch (e) {
        console.log(e.message, 2);
        res.status(403).send(e.message);
    }
});

app.post('/signInUser', async (request, res) => {
    try {
        await chatDal.createUser(JSON.parse(request.body.user));
        res.status(200).send('OK');
    } catch (e) {
        res.status(409).send(e.message);
    }
});

app.post('/users', async (request, res) => {
    const users = await chatDal.readAllUsers();

    res.status(200).send(users);
});

// app.get('/messages', async (request, res) => {
//     const {sender, receiver, chat} = request.query;
//     let users = await  chatDal.readAllUsers();
//     let messages = [];
//
//     if (chat === 'PUBLIC') {
//         messages = await chatDal.readPublicMessages();
//     } else if (chat === "PRIVATE"){
//         messages = await chatDal.readPrivateMessages(sender, receiver);
//     }
//
//     res.status(200).send(chatDal.mergeMessageAndUser(messages, users));
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

            chatDal.createMessage({...data});

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

    // messagePost.handleOnConnect(ws);

    chatDal.readPublicMessages(ws);

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