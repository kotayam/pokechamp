// retrieve id from url query
const url = new URL(location.href);
const partyId = url.searchParams.get("partyId");

// backend api
const DB_APILINK = 'https://pokechamp.onrender.com/api/v1/pokechamp/';

// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';

// html elements
let party;

window.onload = function() {
    let header = document.querySelector(".header");
    header.innerHTML += 
    `<a href="index.html"><h1>PokeChamp</h1></a>`;
    party = document.getElementById("party");
    returnParty(DB_APILINK + partyId);
}

function returnParty(url) {
    fetch(url, {
      method: "GET",
      credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
      const p = data.party;
      if (data.userId === p.userId || data.access == "admin") {
        party.innerHTML += 
        `<div class="toolbar">
        <a href="#" onclick='editParty("${p.title}", "${p.series}", "${p.user}", ${JSON.stringify(p.party)}, "${p.comment}")'>&#9999;&#65039;</a>
        <a href="index.html" onclick="deleteParty()">&#128465;&#65039;</a>`;
      }
      party.innerHTML +=
      `</div>
        <div class="main">
        <h2><strong>Title: </strong>${p.title}</h2>
        <p><strong>Series: </strong>${p.series}</p>
        <p><strong>By: </strong>${p.user}</p>
        <ul class="poke">
        </ul>
        <p><strong>Comment: </strong>${p.comment}</p>
      </div>`;
      let pt = JSON.parse(p.party);
      const poke = document.querySelector(".poke");
      pt.forEach(p => {
        getPokeInfo(POKE_APILINK + p)
        .then(info => {
          poke.innerHTML += 
          `<li>
            <img src=${info[0]} alt="image of ${info[1]}" />
            <div class="stats">
              <p><strong>Name: </strong>${info[1]}</p>
              <p><strong>Type: </strong>${returnString(info[2])}</p>
              <p><strong>Abilities: </strong>${returnString(info[3])}</p>
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
      let types = [];
      for (let i = 0; i < data.types.length; i++) {
        types.push(data.types[i].type.name);
      }
      tgt.push(types);
      let abilities = [];
      for (let i = 0; i < data.abilities.length; i++) {
        abilities.push(data.abilities[i].ability.name);
      }
      tgt.push(abilities);
      return tgt; // 0: img link, 1: name, 2: types, 3: abilities
    } catch (err) {
      console.error(err);
    }
}

function returnString(arr) {
    let tgt = arr[0];
    for (let i = 1; i < arr.length; i++) {
        tgt += `, ${arr[i]}`;
    }
    return tgt;
}

function editParty(title, series, user, pt, comment) {
    party = document.getElementById("party");

    const titleInputId = "title" + partyId;
    const seriesInputId = "series" + partyId;
    const userInputId = "user" + partyId;
    const partyInputId = "party" + partyId;
    const commentInputId = "comment" + partyId;

    party.innerHTML = 
    `<div class="toolbar">
    <a href="#" onclick="saveReview('${titleInputId}', '${seriesInputId}', '${userInputId}', '${partyInputId}', '${commentInputId}')">&#128190;</a>
  </div>
    <div class="main">
    <h2><strong>Title: </strong>
    <input type="text" id='${titleInputId}' value='${title}'>
    </h2>
    <p><strong>Series: </strong>
    <input type="text" id='${seriesInputId}' value='${series}'>
    </p>
    <p><strong>By: </strong>
    <input type="text" id='${userInputId}' value='${user}'>
    </p>
    <p><strong>Party: </strong>
    <input type="text" id='${partyInputId}' oninput="this.size = this.value.length + 1" value='${JSON.parse(pt)}'>
    </p>
    <p><strong>Comment: </strong>
    <input type="text" id='${commentInputId}' oninput="this.size = this.value.length" value='${comment}'></p>
  </div>`
}

function saveReview(titleInputId, seriesInputId, userInputId, partyInputId, commentInputId) {
    const title = document.getElementById(titleInputId).value;
    const series = document.getElementById(seriesInputId).value;
    const user = document.getElementById(userInputId).value;
    let pt = document.getElementById(partyInputId).value.toLowerCase().split(',');
    const comment = document.getElementById(commentInputId).value;

    if (!(title && series && user && pt && comment)) {
        alert("please fill out everything");
        return;
    }
    if (pt.length > 6) {
        alert("party can contain max 6 pokemon");
        return;
    }

    pt = JSON.stringify(pt);

    fetch(DB_APILINK + partyId, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "title": title,
            "series": series,
            "user": user,
            "party": pt,
            "comment": comment
        })
    })
    .then(res => res.json())
    .then(res => {
        location.reload();
    });
}

function deleteParty() {
    fetch(DB_APILINK + partyId, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(res => {
        location.reload();
    });
}