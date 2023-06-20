const url = new URL(location.href);
const userId = url.searchParams.get("userId") || "Guest";

// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';
// backend
const DB_APILINK = 'http://localhost:8000/api/v1/pokechamp/';

// html elements
let posts;
let header;
let newParty;

window.onload = function() {
  header = document.querySelector(".header");
  if (userId === "Guest") {
    header.innerHTML += 
  `<a href="index.html?userId=${userId}"><h1>PokeChamp</h1></a>
  <div class="login">
  <p> Logged in as: ${username}</p>
  <a href="login.html?f=login"><button>Login</button></a>
  </div>`
  } else {
    returnUsername(DB_APILINK + `user/${userId}`);
  }

  if (userId !== "Guest") {
    newParty = document.getElementById("new-party");
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
    let createButton = document.getElementById("create-button");
    createButton.onclick = createParty;
  }
  posts = document.getElementById("posts");
  returnParties(DB_APILINK + `home/${userId}`);
}

function returnUsername(url) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const username = data.username;
      header.innerHTML += 
      `<a href="index.html?userId=${userId}"><h1>PokeChamp</h1></a>
      <div class="login">
      <p> Logged in as: ${username}</p>
      <a href="login.html?f=login"><button>Login</button></a>
      </div>`
    });
}

function returnParties(url) {
  fetch(url)
  .then(res => res.json())
  .then(function(data){
    data.forEach(element => {
      let party = JSON.parse(element.party);
      getPokeIMG(POKE_APILINK + party[0])
      .then(pokeImg => {
        posts.innerHTML += 
        `<a href="party.html?partyId=${element._id}&userId=${userId}">
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

function createParty() {
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

  fetch(DB_APILINK + "home/" + userId, {
    method: 'POST',
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

function refreshPage() {
  location.reload();
}

