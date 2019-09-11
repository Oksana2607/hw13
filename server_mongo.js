const express = require('express');
const mongoose = require('mongoose');
const app = express();
const db = require('./mongo/db');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const config = require('./mongo/config');
const UserRoute = require('./mongo/UserRoute');

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
app.use(express.static('./public'));


// app.post('/logIn', function (req, res) {
//     res.send('POST request to the homepage');
// });

let users, messages;

// const connectDb = async () => {
//     await db.init();
//     users = db.users;
//     messages = db.messages;
// };

// init WS
const server = new WebSocket.Server({port: 4000}, () => {
    console.log('WS server started on port 4000');
});

// init DB
// connectDb()
//     .then(() => {
//         console.log('MongoDB connected');
//     });

// const newUser = {
//     name: 'aaa',
//     password: ' dgfrgfi',
//     email: 'hdfkk@fhvkf.com'
// };
//
// // setTimeout(() =>  users.addUser(newUser),3000);
//
// setTimeout(() =>  db.messages.addMessage({author: 'fhnrfjufh', text: 'rufhriufhuirfhirufhrifh fhrefhirefhriu'}),3000);



//chat
class Chat {
    constructor() {
        this.usersList = [];
    }

    // loginDb = async user => {
    //     const result = await users.findUser(user);
    //
    //     if (result && result.length > 0) {
    //         return result[0];
    //     } else {
    //         const hash = bcrypt.hashSync(user.password, saltRounds);
    //         const newUser = await users.addUser({...user, password: hash});
    //         return newUser.ops[0];
    //     }
    // };
    //
    // findUserDb = user => {
    //     return this.usersList.filter(eachUser => (
    //         eachUser.name === user.name &&
    //         bcrypt.compareSync(user.password, eachUser.password)
    //     ));
    // };
    //
    // addUser = user => {
    //     console.log('chat.addUser', user)
    //     if(this.usersList.length === 0) {
    //         this.usersList.push(user);
    //         return;
    //     }
    //     try {
    //         this.usersList = chat.usersList.filter(eachUser => eachUser._id.toString() !== user._id.toString()).concat(user);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // };
    //
    // removeUser = id => {
    //     this.usersList = this.usersList.filter(user => user._id !== id);
    //     console.log(this.usersList);
    // };

    handleMessage = (message, ws) => {
        const data = JSON.parse(message);
        const time = new Date();

        switch (data.type) {
            case "USER_MESSAGE":
                // messages.addMessage({...data, time: time});
                server.broadcast(JSON.stringify({...data, time: time}), ws);
                break;

            // case "CLOSE":
            //     if (!ws.userData) return;
            //     this.removeUser(ws.userData._id);
            //     server.broadcast(JSON.stringify({
            //         type: 'SERVER_MESSAGE',
            //         text: `${ws.userData.name} left chat`,
            //         time: time
            //     }), ws);
            //     server.broadcast(JSON.stringify({
            //         type: 'USERS_LIST',
            //         usersList: this.usersList,
            //         time: time
            //     }), ws);
            //     break;
            default:
                return;
        }
    };
};

const chat = new Chat();

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
        chat.handleMessage(message, ws);

    });

    ws.on('close', () => {
        const message = JSON.stringify({
            type: 'CLOSE',
        });
        this.handleMessage(message, ws);
    });
});