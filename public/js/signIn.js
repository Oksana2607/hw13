const sendRequest = () => {
    const url = 'http://localhost:3000/user/signIn';
    const _name = document.getElementById('name').value;
    const _email = document.getElementById('email').value;
    const _password = document.getElementById('password').value;
    const _passwordConfirm = document.getElementById('confirm_password').value;

    if (!_name || !_email || !_password || _password !== _passwordConfirm) {
        document.getElementById('error').innerText = `Try again`
    } else {
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
                sessionStorage.setItem('user', JSON.stringify(response));
                location.href='users.html';
            })
            .catch(error => {
                handleError(error);
            });
    }
};

document.getElementById('submitBtnSignIn').addEventListener('click', event => {
    event.preventDefault();
    sendRequest();
});

const handleError = error => {
    document.getElementById('error').innerText = `Error: User exists`;
};