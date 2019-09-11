const name = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm_password");
const email_log = document.getElementById("email_log");
const password_log = document.getElementById("password_log");

function validatePassword(){
    if(password.value !== confirm_password.value) {
        confirm_password.setCustomValidity("Passwords do not match");
    } else {
        confirm_password.setCustomValidity('Access');

    }
}

function signIn(){
    if(!name.value || !email.value || !password.value || password.value !== confirm_password.value) {
        alert("Try again");
    }else if(name.value && email.value && password.value && password.value === confirm_password.value){

        let newUser = {};
        newUser.name = name.value;
        newUser.email = email.value;
        newUser.password = password.value;

        let body = 'newUser=' + encodeURIComponent(JSON.stringify(newUser));
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/signIn', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
        // console.log(body);
    }
}

function signUp(){
    if(!email_log.value || !password_log.value) {
        alert("Try again");
    }else if(email_log.value || password_log.value){
        console.log('123');
        let loginUser = {};
        loginUser.email = email_log.value;
        loginUser.password = password_log.value;

        let body = 'UserAuth=' + encodeURIComponent(JSON.stringify(loginUser));
        const xhr = new XMLHttpRequest();
        xhr.open("POST", '/signUp', true);
        xhr.responseType = 'text';
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    console.log(xhr.response);
                    console.log(xhr.responseText);
                }
            }
        };
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(body);
        // console.log(body);
    }
}
// password.onchange = validatePassword;
// confirm_password.onkeyup = validatePassword;