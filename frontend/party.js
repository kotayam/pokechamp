// backend
const url = new URL(location.href);
const partyId = url.searchParams.get("id");

const DB_APILINK = 'http://localhost:8000/api/v1/parties/';

// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';

// html elements
let party;

window.onload = function() {
    party = document.getElementById("party");
    returnParty(DB_APILINK + partyId);
}

function returnParty(url) {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        party.innerHTML += 
        `<div class="main">
        <h2>Title: ${data.title}</h2>
        <p>Series: ${data.series}</p>
        <p>By: ${data.user}</p>
        <ul class="poke">
        </ul>
        <p>comment: ${data.comment}</p>
      </div>`;
      let pt = JSON.parse(data.party);
      let poke = document.querySelector(".poke");
      pt.forEach(p => {
        getPokeInfo(POKE_APILINK + p).then(info => {
            poke.innerHTML += 
        `<li>
        <img src=${info[0]} alt="image of ${info[1]}" />
        <div class="stats">
          <p>name: ${info[1]}</p>
          <p>type: </p>
          <p>abilities: </p>
        </div>
      </li>`;
        });
      });
    });
    
}

async function getPokeInfo(url) {
    try {
      const res = await fetch(url);
      const data = await res.json();
      let tgt = [];
      tgt.push(data.sprites.front_default);
      tgt.push(data.name);
      return tgt;
    } catch (err) {
      console.error(err);
    }
  }

function editParty() {

}

function deleteParty() {

}