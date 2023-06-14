// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';
// backend
const DB_APILINK = 'http://localhost:8000/api/v1/parties/';

// Access: ADMIN, EDITOR, GUEST
let access = "GUEST";

// html elements
let posts;
let header;

window.onload = function() {
  header = document.querySelector(".header");
  header.innerHTML += 
  `<div class="login">
  <p> You are currently a ${access}</p>
  <button onclick="location.href='login.html'">Login</button>
</div>`
    posts = document.getElementById("posts");
    returnParties(DB_APILINK);
}

function returnParties(url) {
  fetch(url).then(res => res.json())
  .then(function(data){
    data.forEach(element => {
      let party = JSON.parse(element.party);
      getPokeIMG(POKE_APILINK + party[0])
      .then(pokeImg => {
        posts.innerHTML += 
        `<a href="party.html?id=${element._id}">
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

  fetch(DB_APILINK, {
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
        "comment": comment
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

