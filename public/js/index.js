
class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}


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
    }

    renderUsers = () => {
        return this.changeTable.innerHTML = `<div class="users__table" id="usersTable">
                    <table class="users__table table" id="table">
                        <tr class="table__header">
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                        <tr class="table__body">
                            <td>Alex</td>
                            <td>alex245@gmail.com</td>
                        </tr>
                        <tr class="table__body">
                            <td>Stefan</td>
                            <td>stefanx348@gmail.com</td>
                        </tr>
                        <tr class="table__body">
                            <td>Zafar</td>
                            <td>zafar295@gmail.com</td>
                        </tr>
                        <tr class="table__body">
                            <td>Roman</td>
                            <td>roman444@gmail.com</td>
                        </tr>
                        <tr class="table__body">
                            <td>Lesha</td>
                            <td>lesha333@gmail.com</td>
                        </tr>
                    </table>
                </div>`
    };

    renderChat = () => {
        return this.changeTable.innerHTML = `<div class="users__chat chat" id="chat">
                    <div class="chat__title">Chat</div>
                    <div class="chat__body">
                        <input class="chat__input" id="message" type="text">
                        <button class="chat__button" id="sendBtn">Send</button>
                    </div>
                </div>`
    };

    renderChatUsers = () => {
        return this.usersChat.innerHTML = `Users online:
                <div class="users-chat__users">
                    <li class="users-chat">Misha</li>
                    <li class="users-chat">Petya</li>
                    <li class="users-chat">Alex</li>
                    <li class="users-chat">Stephan</li>
                </div>`
    }

    renderWithoutChatUsers = () => {
        return this.usersChat.innerHTML = ``;
    }
}

class App {
    constructor() {
        this.user = new User();
        this.view = new View();
    }

    init() {
        console.log(this.view.submitBtn);
        this.view.usersBtn.addEventListener('click', () => {
            console.log('render users');
            this.view.renderUsers();
            this.view.renderWithoutChatUsers();
        });

        this.view.chatBtn.addEventListener('click', () => {
            console.log('render chat');
            this.view.renderChat();
            this.view.renderChatUsers();
        });

        this.view.submitBtn.addEventListener('click', () => {
            console.log('submit');
            this.signIn();
            // window.location.replace('./public/users')
        })
    }

    createUser() {
        let newUser = {};

        if (!this.view.name.value
            || !this.view.email.value
            || !this.view.password.value
            || this.view.password.value === this.view.confirm_password.value) {
            alert('Please, enter again')
        } else {
            newUser.name = this.view.name.value;
            newUser.email = this.view.email.value;
            newUser.password = this.view.password.value;
        }

        return newUser;
    }

    signIn() {
        const url = '/signIn';
        const data = this.createUser();

        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => console.log('Успех:', JSON.stringify(response)))
            .catch(error => console.error('Ошибка:', error));
    }
}

const app = new App();
app.init();



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