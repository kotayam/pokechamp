// const DB_APILINK = 'https://pcbackend.heppoko.space/api/v1/pokechamp/';
const DB_APILINK = 'http://localhost:8000/api/v1/pokechamp/';

window.onload = function() {
    const url = new URL(location.href);
    const foo = url.searchParams.get("f");

    const loginButton = document.querySelector(".login-button");
    loginButton.addEventListener('click', () => {login('user')});
    const guestLogin = document.querySelector(".guest-login");
    guestLogin.addEventListener('click', () => {login()});
    const createAccButton = document.querySelector(".create-account-button");
    createAccButton.addEventListener('click', () => {createAccount()});

    const loginBox = document.querySelector(".login-box");
    const createAccBox = document.querySelector(".create-account-box");
    const errorBox = document.querySelector(".error-box");

    if (foo === "login") {
        loginBox.style.display = "block";
        createAccBox.style.display = "none";
        errorBox.style.display = "none";
    }
    else if (foo === "create-account") {
        loginBox.style.display = "none";
        createAccBox.style.display = "block";
        errorBox.style.display = "none";
    }
}

function login(access="") {
    let username;
    let password;
    if (access) {
        username = document.getElementById("login-username").value;
        password = document.getElementById("login-password").value;
        if (!(username && password)) {
            alert("please fill out everything");
            return;
        }
    } else {
        username = "guest";
        password = "guest";
    }
    
    fetch(DB_APILINK + "login", {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            location.href = "index.html";
        } else {
            alert(res.message);
        }
    })
    .catch(e => {
        console.error(e); 
        const loginBox = document.querySelector(".login-box");
        const errorBox = document.querySelector(".error-box");
        const errText = document.querySelector(".error-message");
        loginBox.style.display = "none";
        errorBox.style.display = "block";
        errText.innerText = "Failed to login."
    });
}

function createAccount() {
    const newUsername = document.getElementById("create-username").value;
    const newPass = document.getElementById("create-password").value;
    const confirmPass = document.getElementById("create-confirm-password").value;
    console.log(newUsername + newPass + confirmPass);

    if (!(newUsername && newPass && confirmPass)) {
        alert("Please fill out everything");
        return;
    }
    if (newPass !== confirmPass) {
        alert("Password does not match");
        return;
    }

    fetch(DB_APILINK + "create-account", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: newUsername,
            password: newPass
        })
    })
    .then(res => res.json())
    .then(res => {
        if (res.success) {
            location.href = "login.html?f=login";
        } else {
            alert(res.message);
        }
    })
    .catch(e => {
        console.error(e); 
        const createAccBox = document.querySelector(".create-account-box");
        const errorBox = document.querySelector(".error-box");
        const errText = document.querySelector(".error-message");
        createAccBox.style.display = "none";
        errorBox.style.display = "block";
        errText.innerText = "Failed to create new account."
    });
}