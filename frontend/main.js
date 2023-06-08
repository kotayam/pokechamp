// poke api
const APILINK = 'https://pokeapi.co/api/v2/pokemon/mandibuzz';

// retrieved data from database
let pokeName = '';

// html elements
let posts;

window.onload = function() {
    posts = document.getElementById("posts");
    //returnPoke(APILINK);
}

function returnPoke(url) {
    fetch(url).then(res => res.json())
    .then(function(data){
        console.log(data.sprites.front_default);
        posts.innerHTML += 
        `<div class="col">
          <div class="card">
            <div class="thumbnail-container">
              <img class="thumbnail" src="${data.sprites.front_default}" alt="img of pikachu" />
            </div>
            <p class="title">Title: Test Party</p>
            <p class="series">Series: Diamond</p>
            <p class="username">By: heppoko</p>
          </div>
        </div>
      </div>`
    });
}