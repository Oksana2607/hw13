const sendRequest = () => {
    const url = 'http://localhost:3000/user/signIn';
    const _name = document.getElementById('name').value;
    const _email = document.getElementById('email').value;
    const _password = document.getElementById('password').value;

    fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            name: _name,
            email: _email,
            password: _password
        }),
        headers:{
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(response => {
            localStorage.setItem('user', JSON.stringify(response));
            location.href='users.html';
        })
        .catch(error => console.error('Ошибка:', error));
};


document.getElementById('submitBtnSignIn').addEventListener('click', event => {
    event.preventDefault();
    sendRequest();
});