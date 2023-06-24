const DB_APILINK = 'https://pcbackend.heppoko.space/api/v1/pokechamp/';

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
          <p>Don't have an account?</p>
          <a href="login.html?f=create-account"><button>Create new account</button></a>
          <p>or</p>
          <a href="index.html" id="guest-login">Continue as guest</a>
        </div>
        </div>
      </div>`
      const loginButton = document.getElementById("login-button");
      loginButton.addEventListener('click', () => {login("user")});
      const guestLogin = document.getElementById("guest-login");
      guestLogin.addEventListener('click', () => {login()});
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

function login(access="") {
    let username;
    let password;
    if (access) {
        username = document.getElementById("username").value;
        password = document.getElementById("password").value;
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
        console.log(res);
        if (res.success) {
            // location.href = "index.html";
        } else {
            alert(res.message);
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
        if (res.success) {
            location.href = "login.html?f=login";
        } else {
            alert(res.message);
        }
    })
    .catch(e => alert("failed to connect to server"));
}