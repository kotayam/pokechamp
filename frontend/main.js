// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';
// backend
const DB_APILINK = 'https://pcbackend.heppoko.space/api/v1/pokechamp/';

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
    console.log(data);
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
        `<div style="text-align:center">
        <p style="color:red">Session is about to expire.<br>Press "Extend" to keep browsing or "Logout" to end session.</p>
        <button id="extend">Extend</button>
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
        <p>
          Use PokeChamp to see what party other pokemon trainers used to beat
          the champion! Share your party by filling out the form below and
          pressing "Create Post"!
        </p>
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
            <input
              type="text"
              id="newParty"
              oninput="this.size = this.value.length + 1"
              placeholder="pikachu,charizard,mewtwo"
            />
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
      newParty.innerHTML = 
      `<div class="navbar">
        <p style="color:red;text-align:center">Login to create and share your own party!</p>
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
    console.log(e);
    header.innerHTML = 
    `<a href="index.html"><h1>PokeChamp</h1></a>`;
    newParty.innerHTML =
    `<p style="text-align: center;color: red"> Failed to connect to server </p>`;
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
  let party = document.getElementById("newParty").value.toLowerCase().split(",");
  const comment = document.getElementById("newComment").value;

  if (!(title && series && user && party && comment)) {
    alert("please fill out everything");
    return;
  }
  if (party.length > 6) {
    alert("party can contain max 6 pokemon");
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
      location.reload();
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
    console.log(res);
    location.reload();
  });
}

function logOut() {
  console.log('here');
  fetch(DB_APILINK + "logout", {
    method: "POST",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    location.href = 'login.html'
  });
}

function refreshPage() {
  location.reload();
}

