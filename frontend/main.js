// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';
// backend
// const DB_APILINK = 'https://pcbackend.heppoko.space/api/v1/pokechamp/';
const DB_APILINK = 'http://localhost:8000/api/v1/pokechamp/';

window.onload = function() {
  returnParties(DB_APILINK + `home`);
}

function returnParties(url) {
  const header = document.querySelector(".header");
  const newParty = document.getElementById("new-party");
  const posts = document.getElementById("posts");

  fetch(url, {
    method: "GET",
    credentials: 'include'
  })
  .then(res => res.json())
  .then(data => {
    if (!data.success) {
      if (data.refresh) {
        header.innerHTML += 
          `<a href="index.html"><h1>PokeChamp</h1></a>
          <div class="login">
          <a href="login.html?f=login"><button id="logout">Logout</button></a>
          </div>`
        const logout = document.getElementById("logout");
        logout.onclick = logOut;

        newParty.innerHTML += 
        `<div style="max-width:700px;margin:0 auto;text-align:center">
          <div class="head-text">
            <p style="color:red">
            Session is about to expire.<br>Press "Extend" to keep browsing or "Logout" to end session.
            </p>
            <button id="extend">Extend</button>
          </div>
        </div>`;
        const extendButton = document.getElementById("extend");
        extendButton.addEventListener('click', refreshAccess);

        return;
      } else {
        location.href = "login.html?f=login";
        return;
      }
    }
    header.innerHTML += 
      `<a href="index.html"><h1>PokeChamp</h1></a>
      <div class="login">
      <p> Logged in as: ${data.username}</p>
      <a href="login.html?f=login"><button id="logout">Logout</button></a>
      </div>`
    const logout = document.getElementById("logout");
    logout.onclick = logOut;

    if (data.access !== "guest") {
      newParty.innerHTML = 
      `<div class="navbar">
        <div class="head-text">
          <p>
            Welcome to PokeChamp! Use PokeChamp to see what party other pokemon trainers used to beat
            the champion! Share your party by filling out the form below and
            pressing "Create Post"!
          </p>
        </div>
        <div class="new-post">
          <p>
            <strong>Title: </strong>
            <input type="text" id="newTitle" placeholder="New Party" />
          </p>
          <p>
            <strong>Series: </strong>
            <input type="text" id="newSeries" placeholder="Diamond" />
          </p>
          <p>
            <strong>By: </strong>
            <input type="text" id="newUser" placeholder="Username" />
          </p>
          <p>
            <strong>Party: </strong>
            <div class="newParty">
              <input
                type="text"
                id="poke1"
                placeholder="pokemon 1"
              />
              <input
                type="text"
                id="poke2"
                placeholder="pokemon 2"
              />
              <input
                type="text"
                id="poke3"
                placeholder="pokemon 3"
              />
              <input
                type="text"
                id="poke4"
                placeholder="pokemon 4"
              />
              <input
                type="text"
                id="poke5"
                placeholder="pokemon 5"
              />
              <input
                type="text"
                id="poke6"
                placeholder="pokemon 6"
              />
            </div>
          </p>
          <p>
            <strong>Comment: </strong>
            <input
              type="text"
              id="newComment"
              oninput="this.size = this.value.length"
              placeholder="I love this party!"
            />
          </p>
          <button id="create-button" onclick="createParty()">Create Post</button>
        </div>
      </div>`;
      const createButton = document.getElementById("create-button");
      createButton.addEventListener("click", () => {createParty(data.userId);});
    } else {
      newParty.style.borderBottom = "1px solid";
      newParty.style.padding = "0.5rem";
      newParty.innerHTML = 
      `<div style="max-width:700px;margin:0 auto;text-align:center">
          <div class="head-text">
            <p style="color:red">
            Login to create and share your own party!
            </p>
          </div>
        </div>`
    }

    posts.innerHTML += `<button id="refresh">Refresh</button>`;
    const refresh = document.getElementById("refresh");
    refresh.onclick = refreshPage;

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
              <p class="title"><strong>Title: </strong>${element.title}</p>
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
    header.innerHTML = 
    `<a href="index.html"><h1>PokeChamp</h1></a>`;
    newParty.innerHTML =
    `<div style="max-width:700px;margin:0 auto;text-align:center">
        <div class="head-text">
          <p style="color:red">
          Failed to load page.
          </p>
          <a href="index.html">return to home</a>
        </div>
      </div>`
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
    header.innerHTML = 
    `<a href="index.html"><h1>PokeChamp</h1></a>`;
    newParty.innerHTML =
    `<div style="max-width:700px;margin:0 auto;text-align:center">
        <div class="head-text">
          <p style="color:red">
          Failed to create party.
          </p>
          <a href="index.html">return to home</a>
        </div>
      </div>`
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
    header.innerHTML = 
    `<a href="index.html"><h1>PokeChamp</h1></a>`;
    newParty.innerHTML =
    `<div style="max-width:700px;margin:0 auto;text-align:center">
        <div class="head-text">
          <p style="color:red">
          Failed to extend session.
          </p>
          <a href="index.html">return to home</a>
        </div>
      </div>`
  });
}

function logOut() {
  fetch(DB_APILINK + "logout", {
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {

  })
  .catch (e => {
    console.error(e);
    header.innerHTML = 
    `<a href="index.html"><h1>PokeChamp</h1></a>`;
    newParty.innerHTML =
    `<div style="max-width:700px;margin:0 auto;text-align:center">
        <div class="head-text">
          <p style="color:red">
          Failed to log out.
          </p>
          <a href="index.html">return to home</a>
        </div>
      </div>`
  });
}

function refreshPage() {
  location.reload();
}

