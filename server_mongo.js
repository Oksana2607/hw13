const express = require('express');
const mongoose = require('mongoose');
const app = express();
const db = require('./mongo/db');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const config = require('./mongo/config');
const UserRoute = require('./mongo/UserRoute');
const MessageRoute = require('./mongo/MessageRoute');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(config.DB, { useNewUrlParser: true })
    .then(() => {
        console.log('Database is connected')
        },
    err => {
        console.log('Can not connect to the database'+ err)
    }
);

app.listen(PORT, () => {
    console.log('Server is running on PORT:',PORT);
});

app.use('/user', UserRoute);
app.use('/message', MessageRoute);
app.use(express.static('./public'));

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
            break;
        case "CLOSE":
            if (!ws.userData) return;
            this.removeUser(ws.userData._id);
            server.broadcast(JSON.stringify({
                type: 'SERVER_MESSAGE',
                text: `${ws.userData.name} left chat`,
                time: time
            }), ws);
            server.broadcast(JSON.stringify({
                type: 'USERS_LIST',
                usersList: this.usersList,
                time: time
            }), ws);
            break;
        default:
            return;
    }
};

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

    ws.on('message', message => {
        handleMessage(message, ws);

    });

    ws.on('close', () => {
        const message = JSON.stringify({
            type: 'CLOSE',
        });
        handleMessage(message, ws);
    });
});