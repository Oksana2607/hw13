
let ws;
const store = {
    user: '',
    messages: '',
    allUsers: '',
    activeUsers: '',
    isActive: ''
};


class View {
    constructor() {
        this.usersBtn = document.getElementById('usersBtn');
        this.chatBtn = document.getElementById('chatBtn');
        this.chat = document.getElementById('chat');
        this.usersAll = document.getElementById('usersTable');
        this.usersChat = document.getElementById('usersChat');
        this.name = document.getElementById("name");
        this.email = document.getElementById("email");
        this.password = document.getElementById("password");
        this.confirm_password = document.getElementById("confirm_password");
        this.email_log = document.getElementById("email_log");
        this.password_log = document.getElementById("password_log");
        this.submitBtn = document.getElementById('submitBtn');
        this.changeTable = document.getElementById('changeTable');
        this.chatContent = document.getElementById('id="chatContent');
        this.message = document.getElementById('message');
        this.sendBtn = document.getElementById('sendBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
    }

    renderUsers = (users) => {
        console.log(users);
        const tableHeader = `<div class="users__table" id="usersTable">
                    <table class="users__table table" id="table">
                        <tr class="table__header">
                            <th>Name</th>
                            <th>Email</th>
                        </tr>`;
        const usersList = users.map(user => {
            return `<tr class="table__body">
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                        </tr>`
        });

        const tableFooter = `</table>
                </div>`;

        return this.changeTable.innerHTML = tableHeader + usersList.join('') + tableFooter;
    };

    renderChat = () => {
        return this.changeTable.innerHTML = `<div class="users__chat chat" id="chat">
                <div class="chat__title">Chat</div>
                <div class="chat__body" >
                    <div class="chat__content" id="chatContent"></div>
                    <div class="chat__footer">
                        <input class="chat__input" id="message" type="text">
                        <button class="chat__button" id="sendBtn">Send</button>
                    </div>
                </div>
            </div>`
    };

    renderChatUsers = (users) => {
        const usersHeader = `Users online:`;

        const usersList = users.map(user => {
            return `<div class="users-chat__users">
                    <li class="users-chat">${user.name}</li>                    
                </div>`
        });

        return this.usersChat.innerHTML = usersHeader + usersList.join('');
    };

    renderWithoutChatUsers = () => {
        return this.usersChat.innerHTML = ``;
    };

    insertMessage = () => {
        let div = document.createElement('div');
        div.innerHTML = document.getElementById('message').value;
        document.getElementById('chatContent').appendChild(div);
    };

    insertSocketMessage = message => {
        let div = document.createElement('div');
        if (message.user) {
            div.innerHTML = `${message.user}: ${message.text}`;
            document.getElementById('chatContent').appendChild(div);
        } else {
            div.innerHTML = message.text;
            document.getElementById('chatContent').appendChild(div);
        }
    }
}

class App {
    constructor() {
        this.view = new View();
    }

    init() {
        const _user = sessionStorage.getItem('user');

        if (_user !== 'null') {
            store.user = JSON.parse(_user);
            this.view.name.innerHTML += store.user.name;
            this.view.email.innerHTML += store.user.email;
        }

        const _message = sessionStorage.getItem('message');

        if (_message !== 'null') {
            store.messages = JSON.parse(_message);
        }

        this.initUsers();

        const method = event => {
            switch(event.target.id) {
                case 'usersBtn':
                    this.initUsers();
                    break;
                case 'chatBtn':
                    this.view.renderChat();
                    this.initActiveUsers();
                    this.initWs();
                    break;
                case 'sendBtn':
                    this.view.insertMessage();
                    let message = {
                        type: "USER_MESSAGE",
                        text: document.getElementById('message').value,
                        user: store.user.name,
                        time: new Date()
                    };
                    sendMessage(message);
                    document.getElementById('message').value = '';
                    break;
                case 'logoutBtn':
                    sendLogoutRequest();
                    break;
                default:
                    return;
            }
        };

        document.addEventListener('click', method);

        window.onbeforeunload = function () {
            sendLogoutRequest();
        };
    }

    initUsers() {
        sendRequest('getUsers')
            .then(res => res.json())
            .then(response => {
                store.allUsers = response;
                this.view.renderUsers(store.allUsers);
                this.view.renderWithoutChatUsers();
            })
            .catch(error => {
                console.log(error);
            });
    }

    initActiveUsers() {
        sendRequest('getActiveUsers')
            .then(res => res.json())
            .then(response => {
                store.activeUsers = response;
                this.view.renderChatUsers(store.activeUsers);
            })
            .catch(error => {
                console.log(error);
            });
    }

    initWs() {
        ws = new WebSocket('ws://localhost:4000');

        ws.onopen = () => {
            console.log('onopen');
            sendMessage({
                type: 'USER_MESSAGE',
                text: store.user.name + ' join',
                time: new Date()
            });
        };

        ws.onmessage = message => {
            handleMessage(message);
        };

        ws.onclose = () => {
            console.log('onclose');
        };
    }
}

function sendRequest(param) {
    const url = `http://localhost:3000/user/${param}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const sendMessage = (data) => {
    ws.send(JSON.stringify(data));
};

const handleMessage = message => {
    let _message = JSON.parse(message.data);
    console.log(_message);
    app.view.insertSocketMessage(_message);
};

const sendLogoutRequest = () => {
    const url = 'http://localhost:3000/user/logout';

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({id: store.user._id}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => {
            sessionStorage.clear();
            store.user ={};
            location.href='index.html';
        })
        .catch(error => {
            handleError(error);
        });
};

const app = new App();
app.init();

