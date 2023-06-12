// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';
// backend
const DB_APILINK = 'http://localhost:8000/api/v1/parties/';

// html elements
let posts;

window.onload = function() {
    posts = document.getElementById("posts");
    returnParties(DB_APILINK);
}

function returnParties(url) {
  fetch(url).then(res => res.json())
  .then(function(data){
    console.log(data);
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
            <p class="title">Title: ${element.title}</p>
            <p class="series">Series: ${element.series}</p>
            <p class="username">By: ${element.user}</p>
          </div>
        </div>
      </div>
      </a>`
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