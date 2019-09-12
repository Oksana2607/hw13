const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm_password");
const email_log = document.getElementById("email_log");
const password_log = document.getElementById("password_log");
const submitBtnSignIn = document.getElementById("submitBtnSignIn");
const submitBtnSignUp = document.getElementById("submitBtnSignUp");

function setCookie(key) {
    document.cookie = "chat_user=" + key + "; path=/; max-age=600";
}

function validatePassword() {
    if (password.value !== confirm_password.value) {
        confirm_password.setCustomValidity("Passwords do not match");
    } else {
        confirm_password.setCustomValidity('Access');

    }
}

function signIn() {
    if (!name.value || !email.value || !password.value || password.value !== confirm_password.value) {
        alert("Try again");
    } else if (name.value && email.value && password.value && password.value === confirm_password.value) {

        let newUser = {};
        newUser.name = name.value;
        newUser.email = email.value;
        newUser.password = password.value;

        let body = 'newUser=' + encodeURIComponent(JSON.stringify(newUser));
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.open("POST", '/signInUser', true);
        xhr.onload = function () {
            let status = xhr.status;
            let jsonResponse = xhr.response;
            if (status === 404) {
                alert(jsonResponse);
            } else if (status === 200) {
                alert(jsonResponse);
                location.href = 'index.html'
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
    }
}

function signUp() {
    if (!email_log.value || !password_log.value) {
        alert("Try again");
    } else if (email_log.value || password_log.value) {
        let loginUser = {};
        loginUser.email = email_log.value;
        loginUser.password = password_log.value;

        let body = 'UserAuth=' + encodeURIComponent(JSON.stringify(loginUser));
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'text';
        xhr.open("POST", '/signUpUser', true);
        xhr.onload = function () {
            let status = xhr.status;
            let jsonResponse = xhr.response;
            if (status === 404) {
                alert(jsonResponse);
            } else if (status === 200) {
                alert('привет ' + jsonResponse);
            }
            setCookie(jsonResponse);
        };
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
    }
}

// password.onchange = validatePassword;
// confirm_password.onkeyup = validatePassword;