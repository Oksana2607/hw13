


const sendRequest = () => {
    const url = 'http://localhost:3000/user/login';
    const _email = document.getElementById('email_log').value;
    const _password = document.getElementById('password_log').value;

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            email: _email,
            password: _password
        }),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => {
            sessionStorage.setItem('user', JSON.stringify(response));
            location.href='users.html';
        })
        .catch(error => {
            handleError(error);
        });
};

document.getElementById('submitBtn').addEventListener('click', event => {
    event.preventDefault();
    sendRequest();
});

const handleError = error => {
    document.getElementById('error').innerText = `Error: Unauthorized`;
};

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