const socket = require('socket.io');
const express = require('express');
const bodyParser = require('body-parser');
const constants = require('./constants');
const ChatDAL = require('./dal/chatDAL');
const jsonParser = bodyParser.json();

const app = express();
app.use(express.static('public'));
app.use(express.json());

const server = app.listen(3001);
const io = socket(server);

const chatDal = new ChatDAL();
chatDal.initialize();

let users = {};

io.sockets.on(constants.CONNECTION, function(socket){
    socket.on(constants.MESSAGE, handleMessage);

    socket.on(constants.ONLINE, idUser => {
        let idOnline = [];

        if (idUser) {
            users[socket.id] = idUser;
        }

        for (let key in users) {
            idOnline.push(users[key]);
        }

        io.sockets.emit(constants.ONLINE, idOnline);
    });

    socket.on(constants.DISCONNECT, () => {
        io.sockets.emit(constants.OFFLINE, users[socket.id]);
        delete users[socket.id];
    });
});

async function handleMessage(message) {
    await chatDal.createMessage(message);
    const user = await chatDal.readUserToId(message.sender);

    const oneMessage = {
        message: message.message,
        date: message.date,
        name: user[0].name,
        email: user[0].email
    };

    io.sockets.emit(constants.MESSAGE, oneMessage);
}

app.post('/message', jsonParser, async (request, res) => {
    await chatDal.createMessage(request.body);
    io.sockets.emit(constants.MESSAGE, request.body);

    res.status(200).send('OK');
});

app.post('/auth', jsonParser, async (request, res) => {
    try {
        const { email, password } = request.body;
        const user = await chatDal.readUser(email, password);
        res.status(200).send(user);
    } catch (e) {
        res.status(403).send(e.message);
    }
});

app.post('/signInUser', jsonParser, async (request, res) => {
    try {
        await chatDal.createUser(request.body);
        res.status(200).send('OK');
    } catch (e) {
        res.status(409).send(e.message);
    }
});

app.get('/users', async (request, res) => {
    const users = await chatDal.readAllUsers();

    res.status(200).send(users);
});

app.get('/messages', async (request, res) => {
    const {sender, receiver, chat} = request.query;
    let users = await  chatDal.readAllUsers();
    let messages = [];

    if (chat === 'PUBLIC') {
        messages = await chatDal.readPublicMessages();
    } else if (chat === "PRIVATE"){
        messages = await chatDal.readPrivateMessages(sender, receiver);
    }

    res.status(200).send(chatDal.mergeMessageAndUser(messages, users));
});