const DB_APILINK = 'http://localhost:8000/api/v1/pokechamp/';

window.onload = function() {
    const url = new URL(location.href);
    const foo = url.searchParams.get("f");

    let acc = document.getElementById("account");

    if (foo === "login") {
        acc.innerHTML = 
        `<div class="login-box">
        <div class="username-box">
          <p>Username:</p>
          <input id="username" type="text" placeholder="Username" />
        </div>
        <div class="password-box">
          <p>Password:</p>
          <input id="password" type="password" placeholder="Password" />
        </div>
        <div class="function-box">
          <button id="login-button">Login</button>
          <p>or</p>
          <a href="login.html?f=create-account">Create new account</a>
        </div>
        <a href="index.html">return to home</a>
      </div>`
      const loginButton = document.getElementById("login-button");
      loginButton.onclick = login;
    }
    else if (foo === "create-account") {
        acc.innerHTML = 
        `<div class="login-box">
        <div class="username-box">
          <p>New Username:</p>
          <input id="username" type="text" placeholder="New username" />
        </div>
        <div class="password-box">
          <p>New Password:</p>
          <input id="password" type="password" placeholder="New password" />
        </div>
        <div class="confirm-password-box">
          <p>Confirm Password:</p>
          <input id="confirm-password" type="password" placeholder="Confirm password" />
        </div>
        <div class="function-box">
          <button id="create-account-button">Create Account</button>
        </div>
        <a href="index.html">return to home</a>
      </div>`
      const createAccButton = document.getElementById("create-account-button");
      createAccButton.onclick = createAccount;
    }
}

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!(username && password)) {
        alert("please fill out everything");
        return;
    }

    fetch(DB_APILINK + "login", {
        method: "POST",
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(res => res.json())
    .then(res => {
        if (res.status === "success") {
            location.href = `index.html?userId=${res.userId}`;
        } else {
            alert("incorrect username or password")
        }
    })
    .catch(e => alert("failed to connect to server"));
}

function createAccount() {
    const newUsername = document.getElementById("username").value;
    const newPass = document.getElementById("password").value;
    const confirmPass = document.getElementById("confirm-password").value;

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
        if (res.status === "success") {
            location.href = "login.html?f=login";
        } else {
            alert("username already exists")
        }
    })
    .catch(e => alert("failed to connect to server"));
}