import logout from "./main.js";

const DB_APILINK = 'https://pcbackend.heppoko.space/api/v1/pokechamp/';
// const DB_APILINK = 'http://localhost:8000/api/v1/pokechamp/';

window.onload = function() {
    returnAccountInfo();
}

function returnAccountInfo() {
    const errorBox = document.querySelector(".error-box");
    const errorText = document.querySelector(".error-message");
    const accountContainer = document.querySelector(".account-container");
    const username = document.querySelector("#account-username");
    const numParty = document.querySelector("#account-numparty");
    const parties = document.querySelector("#account-parties");
    const deleteButton = document.querySelector("#account-delete-button");

    fetch(DB_APILINK + "account", {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
        if (!res.success) {
            if (res.refresh) {
                location.href = "index.html";
                return;
            } else {
                throw new Error("Failed to load accout information");
            }
        }
        if (res.access === "guest") {
            errorBox.style.display = "block";
            errorText.innerText = "Login to view your account information!"
            return;
        }
        accountContainer.style.display = "block";
        username.innerHTML = `<strong>Username: </strong>${res.username}`;
        numParty.innerHTML = `<strong>Number of party created: </strong>${res.numParty}`;
        parties.innerHTML = `<strong>Your parties: </strong>`;
        res.parties.forEach(partyId => {
            returnPartyName(partyId);
        })
        deleteButton.addEventListener('click', () => {confirmDelete()})

    })
    .catch(e => {
        console.error(e);
        errorBox.style.display = "block";
        errorText.innerText = "Failed to load account information."
    });
}

function returnPartyName(partyId) {
    fetch(DB_APILINK + `party/${partyId}`, {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.json())
    .then(res => {
        const parties = document.querySelector("#account-parties");
        parties.innerHTML += `<a href="party.html?partyId=${partyId}">${res.party.title}</a>, `
    })
    .catch(e => {
        console.error(e);
    })
}

function confirmDelete() {
    const cancelButton = document.querySelector("#cancel-button");
    const accountInfo = document.querySelector(".account-info");

    cancelButton.style.display = "inline-block";
    cancelButton.addEventListener('click', () => {location.href = "account.html"});
    accountInfo.innerHTML = 
    `<p>You will no longer be able to edit your parties once you delete your account.
    <br>Would you like to delete your account?
    </p>
    <button id="delete-yes" style="margin:5px;padding:2px;font-size:1rem;color:red">Yes</button>
    <button id="delete-no" style="margin:5px;padding:2px;font-size:1rem">No</button>`;

    const deleteYes = document.querySelector("#delete-yes");
    const deleteNo = document.querySelector("#delete-no");
    deleteYes.addEventListener('click', () => {deleteAccount()});
    deleteNo.addEventListener('click', () => {location.href = "account.html"});
}

function deleteAccount() {
    fetch(DB_APILINK + "account", {
        method: "DELETE",
        credentials: "include"
    })
    .then(res => res.json())
    .then(res => {
        if (!res.success) {
            if (res.refresh) {
              location.href = "index.html";
              return;
            } else {
              throw new Error("failed to delete account");
            }
        }
        logout();
        location.href = "login.html?f=login";
    })
    .catch(e => {
        console.error(e);
        errorBox.style.display = "block";
        errorText.innerText = "Failed to delete account"
    })
}