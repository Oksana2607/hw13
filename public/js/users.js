
let ws;

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
        const tableHeader = `<div class="users__table" id="usersTable">
                    <table class="users__table table" id="table">
                        <tr class="table__header"> 
                            <th>Status</th>                      
                            <th>Name</th>
                            <th>Email</th>
                            <th></th>
                        </tr>`;
        const usersListActive = users.filter(user => user.isActive === true);
        const activeList = usersListActive.map(user => {
            return `<tr class="table__body">
                            <td class="table__body-centred"><div class="table__body-statusActive"></div></td>                            
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td><button id="${user._id}" class="private_chat" onclick="handleUserClick(id)">Private Chat</button></td>
                        </tr>`
        });

        const usersListOffline = users.filter(user => user.isActive === false);
        const offlineList = usersListOffline.map(user => {
            return `<tr class="table__body">
                            <td class="table__body-centred"><div class="table__body-statusOffline"></div></td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td><button id="${user._id}" class="private_chat" onclick="handleUserClick(id)">Private Chat</button></td>
                        </tr>`
        });

        const tableFooter = `</table>
                </div>`;

        return this.changeTable.innerHTML = tableHeader + activeList.join('') + offlineList.join('') + tableFooter;
    };

    renderChat = () => {
        let chatTitle = 'Chat';
        if (store._receiver_id) {
            let receiver = store._allUsers.find(user => user._id === store._receiver_id);
            console.log(receiver);
            chatTitle += ` with ${receiver.name}`;
        }
        return this.changeTable.innerHTML = `<div class="users__chat chat" id="chat">    
                <div class="chat__title">${chatTitle}</div>
                <div class="chat__body" >
                    <div class="chat__content" id="chatContent">
                    </div>
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
        const  chatContent = document.getElementById('chatContent');
        const div = document.createElement('div');
        div.className = 'outgoing';
        div.innerHTML = document.getElementById('message').value;
        chatContent.appendChild(div);
        chatContent.scrollTop = chatContent.scrollHeight;
    };

    insertSocketMessage = message => {
        const chatContent = document.getElementById('chatContent');
        const div = document.createElement('div');
        div.className = 'incoming';

        if (message.type === "USER_MESSAGE"|| message.type === "CLOSE") {
            div.className = 'system-message';
        }

        if (message.user === store._user.name) {
            div.className = 'outgoing';
        }

        if (message.user) {
            div.innerHTML = `${message.user}: ${message.text}`;
            chatContent.appendChild(div);
        } else {
            div.innerHTML = message.text;
            chatContent.appendChild(div);
        }

        chatContent.scrollTop = chatContent.scrollHeight;
    }
}

class App {
    constructor() {
        this.view = new View();
    }

    init() {
        let _user = sessionStorage.getItem('user');

        if (_user !== 'null') {
            _user = JSON.parse(_user);
            store.addUser(_user);
            this.view.name.innerHTML += _user.name;
            this.view.email.innerHTML += _user.email;
        }

        this.initUsers();

        const method = event => {
            let _user = JSON.parse(sessionStorage.getItem('user'));
            switch(event.target.id) {
                case 'usersBtn':
                    this.initUsers();
                    break;
                case 'chatBtn':
                    store._receiver_id = '';
                    this.view.renderChat();
                    this.initActiveUsers();
                    this.closeWs();
                    this.initWs();
                    break;
                case 'sendBtn':
                        handleSendMessage();
                    break;
                case 'logoutBtn':
                    if (ws) {
                        sendMessage({
                            type: 'CLOSE',
                            text: _user.name + ' left',
                            time: new Date()
                        });
                        ws.close();
                    }
                    sendLogoutRequest();
                    break;
                default:
                    return;
            }
        };

        document.addEventListener('click', method);
        document.addEventListener('keydown', event => {
            if (event.target.id ==='message' && event.key === "Enter") {
                handleSendMessage();
            }
        });


        window.onbeforeunload = function () {
            if (ws) {
                sendMessage({
                    type: 'CLOSE',
                    text: _user.name + ' left',
                    time: new Date()
                });
                ws.close();
            }
            sendLogoutRequest();
            this.view.renderChatUsers();
        };
    }

    initUsers() {
        sendRequest('getUsers')
            .then(res => res.json())
            .then(response => {
                // store.allUsers = response;
                store.addUsers(response);
                this.view.renderUsers(store.getUsers());
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
                store.addActiveUsers(response);
                this.view.renderChatUsers(store.getActiveUsers());
            })
            .catch(error => {
                console.log(error);
            });
    }

    initWs() {
        ws = new WebSocket('ws://localhost:4000');
        let _user = store._user;
        ws.onopen = () => {
            console.log('onopen');
            sendMessage({
                type: 'USER_MESSAGE',
                text: _user.name + ' join',
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

    closeWs() {
        if(ws) {
            ws.close();
            ws = null;
        }
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

const handleSendMessage = () => {
    app.view.insertMessage();
    let message = {
        type: "USER_MESSAGE",
        text: document.getElementById('message').value,
        user: store._user.name,
        time: new Date(),
        user_id: store._user._id,
        receiver_id: store._receiver_id
    };
    sendMessage(message);
    document.getElementById('message').value = '';
};

const handleMessage = message => {
    let _message = JSON.parse(message.data);
    if (checkMessages(_message)) {
        store.addMessage(_message);
        app.view.insertSocketMessage(_message);
    }
};

const checkMessages = message => {
    if (store._receiver_id) {
        if (store._user._id === message.user_id && store._receiver_id === message.receiver_id) {
            return true
        }

        if (store._user._id === message.receiver_id && store._receiver_id === message.user_id) {
            return true
        }

        return false
    } else {
        if (message.receiver_id) {

            return false;
        } else {
            return true;
        }
    }
};

const sendLogoutRequest = () => {
    const url = 'http://localhost:3000/user/logout';
    let _user = JSON.parse(sessionStorage.getItem('user'));

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({id: _user._id}),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => {
            sessionStorage.clear();
            store.user = {};
            location.href='index.html';
        })
        .catch(error => {
            handleError(error);
        });
};

function handleUserClick(userId) {
    console.log('userId', userId);
    store._receiver_id = userId;
    app.view.renderChat();
    app.initActiveUsers();
    app.closeWs();
    app.initWs();
}

const store = new Store();
const app = new App();
app.init();

