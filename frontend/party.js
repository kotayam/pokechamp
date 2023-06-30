// retrieve id from url query
const url = new URL(location.href);
const partyId = url.searchParams.get("partyId");

// backend api
const DB_APILINK = 'https://pcbackend.heppoko.space/api/v1/pokechamp/party/';
// const DB_APILINK = 'http://localhost:8000/api/v1/pokechamp/party/';

// poke api
const POKE_APILINK = 'https://pokeapi.co/api/v2/pokemon/';

window.onload = function() {
    returnParty(DB_APILINK + partyId);
}

function returnParty(url) {
  const partyContainer = document.querySelector(".party-container");
  const toolbar = document.querySelector(".toolbar");
  const editButton = document.getElementById("edit-button");
  const deleteButton = document.getElementById("delete-button");
  const mainParty = document.querySelector(".main-party");
  const errorBox = document.querySelector(".error-box");
  const errText = document.querySelector(".error-message");

  fetch(url, {
    method: "GET",
    credentials: 'include'
  })
  .then(res => res.json())
  .then(data => {
    console.log(data);
    if (!data.success) {
      location.href = "index.html";
    }
    partyContainer.style.display = "block";
    toolbar.style.display = "block";

    const p = data.party;
    if (data.userId === p.userId || data.access == "admin") {
      editButton.style.display = "inline-block";
      editButton.addEventListener('click', () => {editParty(p.title, p.series, p.user, JSON.parse(p.party), p.comment)});
      deleteButton.style.display = "inline-block";
      deleteButton.addEventListener('click', () => {deleteParty()});
    }

    mainParty.style.display = "block";
    mainParty.innerHTML +=
    `<div class="main">
      <h2  style="overflow:scroll"><strong>Title: </strong>${p.title}</h2>
      <p style="overflow:scroll;"><strong>Series: </strong>${p.series}</p>
      <p style="overflow:scroll;"><strong>By: </strong>${p.user}</p>
      <ul class="poke">
      </ul>
      <p style="overflow:scroll;white-space:normal"><strong>Comment: </strong>${p.comment}</p>
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
  })
  .catch (e => {
    console.error(e);
    toolbar.style.display = "none";
    mainParty.style.display = "none";
    errorBox.style.display = "block";
    errText.innerText = "Failed to load party.";
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
  const titleInputId = "title" + partyId;
  const seriesInputId = "series" + partyId;
  const userInputId = "user" + partyId;
  const commentInputId = "comment" + partyId;

  const editButton = document.getElementById("edit-button");
  const deleteButton = document.getElementById("delete-button");
  const saveButton = document.getElementById("save-button");
  const cancelButton = document.getElementById("cancel-button");
  editButton.style.display = "none";
  deleteButton.style.display = "none";
  saveButton.style.display = "inline-block";
  saveButton.addEventListener('click', () => {saveReview(titleInputId, seriesInputId, userInputId, commentInputId)})
  cancelButton.style.display = "inline-block";
  cancelButton.addEventListener('click', () => {location.href = `party.html?partyId=${partyId}`});

  const mainParty = document.querySelector(".main-party");
  mainParty.innerHTML = 
  `<div class="main">
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
      <div class="newParty">
        <input type="text" id="poke1" value='${pt[0] || ""}'/>
        <input type="text" id="poke2" value='${pt[1] || ""}'/>
        <input type="text" id="poke3" value='${pt[2] || ""}'/>
        <input type="text" id="poke4" value='${pt[3] || ""}'/>
        <input type="text" id="poke5" value='${pt[4] || ""}'/>
        <input type="text" id="poke6" value='${pt[5] || ""}'/>
      </div>
    </p>
    <p><strong>Comment: </strong>
    <input type="text" id='${commentInputId}' value='${comment}'></p>
  </div>`
}

function saveReview(titleInputId, seriesInputId, userInputId, commentInputId) {
  const title = document.getElementById(titleInputId).value;
  const series = document.getElementById(seriesInputId).value;
  const user = document.getElementById(userInputId).value;
  const comment = document.getElementById(commentInputId).value;
  let pt = [];
  for (let i = 1; i < 7; i++) {
    let pokeNum = "poke" + i;
    let poke = document.getElementById(pokeNum).value.trim().toLowerCase();
    if (poke) {
      pt.push(poke);
    }
  }
  if (!(title && series && user &&  comment && pt.length > 0)) {
      alert("please fill out everything");
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
    console.log(res);
    if (!res.success) {
      if (res.refresh) {
        location.href = "index.html";
      } else {
        throw new Error("failed to save update");
      }
    }
    location.reload();
  })
  .catch (e => {
    console.error(e);
    const partyContainer = document.querySelector(".party-container");
    const errorBox = document.querySelector(".error-box");
    const errText = document.querySelector(".error-message");
    partyContainer.style.display = "none";
    errorBox.style.display = "block";
    errText.innerText = "Failed to save update.";
  });
}

function deleteParty() {
  fetch(DB_APILINK + partyId, {
      method: 'DELETE',
      credentials: 'include'
  })
  .then(res => res.json())
  .then(res => {
    console.log(res);
    if (!res.success) {
      if (res.refresh) {
        location.href = "index.html";
      } else {
        throw new Error("failed to delete party");
      }
    }
    location.href = "index.html";
  })
  .catch (e => {
    console.error(e);
    const partyContainer = document.querySelector(".party-container");
    const errorBox = document.querySelector(".error-box");
    const errText = document.querySelector(".error-message");
    partyContainer.style.display = "none";
    errorBox.style.display = "block";
    errText.innerText = "Failed to delete party.";
  });
}