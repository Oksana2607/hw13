const store = {
    user: '',
    messages: '',
    activeUsers: '',
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
    }

    renderUsers = (users) => {
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
                <div class="chat__body">
                    <div class="chat__content" id="chatContent">
                        <div class="chat__message">Hello</div>
                        <div class="chat__message">Hello</div>
                        <div class="chat__message">Hello</div>
                        <div class="chat__message">Hello</div>
                        <div class="chat__message">Hello</div>
                        <div class="chat__message">Hello</div>

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
    }

    insertMessage = () => {
        let div = document.createElement('div');
        div.innerHTML = this.message.value;
        this.chatContent.appendChild(div);
    }
}

class App {
    constructor() {
        this.view = new View();
    }

    init() {
        const _user = localStorage.getItem('user');

        if (_user !== 'null') {
            store.user = JSON.parse(_user);
            this.view.name.innerHTML += store.user.name;
            this.view.email.innerHTML += store.user.email;
        }

        this.view.usersBtn.addEventListener('click', () => {
            console.log('render users');
            sendRequest()
                .then(res => res.json())
                .then(response => {
                    store.activeUsers = response;
                    this.view.renderUsers(store.activeUsers);
                    this.view.renderWithoutChatUsers();
                    console.log(store.activeUsers);
                })
                .catch(error => {
                    console.log(error);
                });
        });

        this.view.chatBtn.addEventListener('click', () => {
            this.view.renderChat();
            this.view.renderChatUsers(store.activeUsers);
            this.view.sendBtn.addEventListener('click', () => {
                console.log('send message');
                this.view.insertMessage();
            });
        });
    }
}

const app = new App();
app.init();

function sendRequest() {
    const url = 'http://localhost:3000/user/getUsers';

    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}


// const ws = new WebSocket('ws://localhost:4000');
//
// const sendMessage = (data) => {
//     ws.send(JSON.stringify(data));
// };
//
// ws.onopen = () => {
//     console.log('onopen');
//     sendMessage('hello from front end');
// };
//
// ws.onmessage = message => {
//    console.log('message', message.data);
//
// };
//
// ws.onclose = () => {
//     console.log('onclose');
// };
//
//
// setInterval(() => sendMessage(
//     {
//         type: 'USER_MESSAGE',
//         text: 'from user!',
//         time: new Date()
//     }
// ), 5000);