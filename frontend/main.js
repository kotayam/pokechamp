// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';
// backend
const DB_APILINK = 'https://pcbackend.heppoko.space/api/v1/pokechamp/';
// const DB_APILINK = 'http://localhost:8000/api/v1/pokechamp/';

window.onload = function() {
  returnParties(DB_APILINK + `home`);
}

function returnParties(url) {
  const logoutButton = document.querySelector("#logout-button");
  const extendButton = document.querySelector("#extend-button");
  const accountButton = document.querySelector("#account-button");
  const accountHeader = document.querySelector(".account");
  const accountText = document.querySelector("#account-text");
  const extendBox = document.querySelector(".extend-box");
  const newPartyContainer = document.querySelector(".new-party-container");
  const createButton = document.querySelector("#create-button");
  const guestLoginBox = document.querySelector(".guest-login-box");
  const posts = document.querySelector("#posts");
  const errorBox = document.querySelector(".error-box");
  const errorText = document.querySelector(".error-message");
  const errorRedirect = document.querySelector(".error-redirect");
  const loadingBox = document.querySelector(".loading-box");

  fetch(url, {
    method: "GET",
    credentials: 'include'
  })
  .then(res => res.json())
  .then(data => {
    loadingBox.style.display = "none";
    if (!data.success) {
      if (data.refresh) {
        extendBox.style.display = "block";
        extendButton.addEventListener('click', () => {refreshAccess()});
        return;
      } else {
        location.href = "login.html?f=login";
        return;
      }
    }
    if (data.access === "admin") {
      accountText.innerText = `Logged in as: Admin`;
    } else {
      accountText.innerText = `Logged in as: ${data.username}`;
    }
    accountHeader.style.display = "block";
    logoutButton.addEventListener('click', () => {logout()});
    accountButton.addEventListener('click', () => {location.href = "account.html"});

    if (data.access !== "guest") {
      newPartyContainer.style.display = "block";
      createButton.addEventListener("click", () => {createParty(data.userId)});
    } else {
      guestLoginBox.style.display = "block";
    }

    const parties = data.parties;
    parties.forEach(element => {
      let party = JSON.parse(element.party);
      getPokeIMG(POKE_APILINK + party[0])
      .then(pokeImg => {
        posts.innerHTML += 
        `<a href="party.html?partyId=${element._id}">
          <div class="row">
            <div class="col">
              <div class="card">
                <div class="thumbnail-container">
                  <img class="thumbnail" src="${pokeImg}" alt="img of ${party[0]}" />
                </div>
                <p class="title" style=""><strong>Title: </strong>${element.title}</p>
                <p class="series"><strong>Series: </strong>${element.series}</p>
                <p class="username"><strong>By: </strong>${element.user}</p>
              </div>
            </div>
          </div>
        </a>`;
      });
    });
  })
  .catch (e => {
    console.error(e);
    errorBox.style.display = "block";
    errorText.innerText = "Failed to load home page."
    errorRedirect.href = "login.html?f=login";
    errorRedirect.innerText = "return to login page";
  });
}

async function getPokeIMG(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.sprites.front_default;
  } catch (err) {
    console.error(err);
  }
}

function createParty(userId) {
  const title = document.getElementById("newTitle").value;
  const series = document.getElementById("newSeries").value;
  const user = document.getElementById("newUser").value;
  const comment = document.getElementById("newComment").value;
  let party = [];
  for (let i = 1; i < 7; i++) {
    let pokeNum = "poke" + i;
    let poke = document.getElementById(pokeNum).value.trim().toLowerCase();
    if (poke) {
      party.push(poke);
    }
  }

  if (!(title && series && user && comment && party.length > 0)) {
    alert("please fill out everything");
    return;
  }

  party = JSON.stringify(party);

  fetch(DB_APILINK + "home", {
    method: 'POST',
    credentials: "include",
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "title": title,
        "series": series,
        "user": user,
        "party": party,
        "comment": comment,
        "userId": userId
    })
  })
  .then(res => res.json())
  .then(res => {
    if (!res.success) {
      if (res.refresh) {
        location.reload();
      } else {
        throw new Error("failed to save party");
      }
    }
    location.reload();
  })
  .catch (e => {
    console.error(e);
    const errorBox = document.querySelector(".error-box");
    const errorText = document.querySelector(".error-message");
    errorBox.style.display = "block";
    errorText.innerText = "Failed to create party.";
  });
}

function refreshAccess() {
  fetch(DB_APILINK + "refresh", {
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    location.reload();
  })
  .catch (e => {
    console.error(e);
    const errorBox = document.querySelector(".error-box");
    const errorText = document.querySelector(".error-message");
    errorBox.style.display = "block";
    errorText.innerText = "Failed to extend session.";
  });
}

function logout() {
  fetch(DB_APILINK + "logout", {
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    if (res.success) {
      location.href = "login.html?f=login";
    } else {
      throw new Error("failed to logout");
    }
  })
  .catch (e => {
    console.error(e);
    const errorBox = document.querySelector(".error-box");
    const errorText = document.querySelector(".error-message");
    errorBox.style.display = "block";
    errorText.innerText = "Failed to log out.";
  });
}