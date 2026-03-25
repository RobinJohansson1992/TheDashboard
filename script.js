//clock and date-------------------------
function TimeNow() {
  const d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();

  if (h < 10) {
    h = "0" + h;
  }
  if (m < 10) {
    m = "0" + m;
  }

  document.getElementById("show-time").innerHTML = h + ":" + m;
  setTimeout(TimeNow, 1000);
}
function DateNow() {
  const d = new Date();
  let day = d.getDate();
  let month = new Date().toLocaleDateString("sv", { month: "long" });
  let year = d.getFullYear();

  document.getElementById("show-date").innerHTML =
    day + " " + month + " " + year;
  setTimeout(DateNow, 1000);
}

// Header------------------------------
const header = document.getElementById("headerInput");
const savedHeader = localStorage.getItem("headerTitle");
header.contentEditable = "true";
header.spellcheck = "false";
if (savedHeader) header.textContent = savedHeader;

header.addEventListener("input", () => {
  localStorage.setItem("headerTitle", header.textContent);
});

// Links-----------------------------
const addLink = document.getElementById("addLinkBtn");
const popup = document.getElementById("popup");

// add link button:
addLink.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.remove("hidden");
});

const closeBtn = document.getElementById("closeBtn");
// close popup window:
closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.add("hidden");
});

// add new link:
const linkInput = document.getElementById("linkInput");
const titleInput = document.getElementById("nameInput");
const addBtn = document.getElementById("addBtn");

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const link = linkInput.value.trim();
  const title = titleInput.value.trim();

  if (!link || !title) {
    return;
  }
  // make sure the link starts with http/ https:
  const completeUrl = link.startsWith("http") ? link : "https://" + link;

  // use url to get icon from google:
  const finalLink = new URL(completeUrl).hostname;
  const urlIcon = `https://www.google.com/s2/favicons?domain=${finalLink}&sz=64`;

  // create new div:
  const newBigLink = document.createElement("div");
  newBigLink.classList.add("bigLink");
  newBigLink.innerHTML = `
  <div class="bigLinkText">
  <img src="${urlIcon}" alt="${finalLink}" width="32" height="32">
    <a href="${completeUrl}" target="_blank">${title}</a>
    </div>
    <div class="bigLinkRemoveButton">
    <button class="removeBtn">-</button>
    </div>
  `;

  newBigLink.querySelector(".removeBtn").addEventListener("click", (e) => {
    e.preventDefault();
    newBigLink.remove();
  });

  const linkList = document.getElementById("linkList");
  linkList.prepend(newBigLink);

  // reset and close popup:
  linkInput.value = "";
  titleInput.value = "";
  popup.classList.add("hidden");
});
// weather-----------------------
const baseURL = "https://api.open-meteo.com/v1/";
const weatherList = document.getElementById("weatherList");

const weathers = {
  0: ["Soligt", "☀️"],
  1: ["Lätt molnigt", "🌤️"],
  2: ["Halvklart", "⛅"],
  3: ["Molnigt", "☁️"],
  45: ["Dimma", "🌫️"],
  48: ["Dimma", "🌫️"],
  51: ["Regn", "🌧️"],
  53: ["Regn", "🌧️"],
  55: ["Regn", "🌧️"],
  56: ["Regn", "🌧️"],
  57: ["Regn", "🌧️"],
  55: ["Regn", "🌧️"],
  61: ["Regn", "🌧️"],
  63: ["Regn", "🌧️"],
  65: ["Regn", "🌧️"],
  66: ["Regn", "🌧️"],
  67: ["Regn", "🌧️"],
  71: ["Snö", "🌨️"],
  73: ["Snö", "🌨️"],
  75: ["Snö", "🌨️"],
  77: ["Snö", "🌨️"],
  80: ["Regn", "🌧️"],
  81: ["Regn", "🌧️"],
  82: ["Regn", "🌧️"],
  85: ["Regn", "🌧️"],
  86: ["Regn", "🌧️"],
  95: ["Åska", "🌩️"],
  96: ["Åska", "🌩️"],
  99: ["Åska", "🌩️"],
};

async function fetchForecast() {
  try {
    const response = await fetch(
      `${baseURL}forecast?latitude=57.1056&longitude=12.2508&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FStockholm&forecast_days=3`,
    );

    if (!response.ok) {
      throw new Error("Kunde inte hämta data");
    }

    const data = await response.json();
    createList(data.daily);
  } catch (error) {
    showError(error.message);
  }
}
function createList(daily) {
  weatherList.innerHTML = "";

  daily.time.forEach((date, index) => {
    const code = daily.weather_code[index];
    const [text, icon] = weathers[code] ?? ["Okänt", "❓"];

    const iconDiv = document.createElement("div");
    iconDiv.textContent = icon;
    iconDiv.classList.add("weatherIcon");

    const li = document.createElement("li");

    li.classList = "weatherItem";
    if (index === 0) {
      date = "idag";
    }
    if (index === 1) {
      date = "imorgon";
    }
    if (index === 2) {
      date = "i övermorgon";
    }

    li.appendChild(iconDiv);
    li.innerHTML += `
    <div class="weatherBox">
    <span class="weatherDate">${date} <br></span>
    <div class="tempText">
    <span class="weatherTemp">${daily.temperature_2m_max[index]}° </span> 
    <span class="weatherText">${text} </span></div></div>`;
    // lägga till nån mer funktion om man klickar?
    weatherList.appendChild(li);
  });
}
// function showError(message) {
//   error.textContent = message;
// }
fetchForecast();

// notes ---------------------------------------
const notepad = document.getElementById("notes");
const savedNotes = localStorage.getItem("savedNotes");

if (savedNotes) {
  notepad.innerText = savedNotes;
}
notepad.addEventListener("input", () => {
  localStorage.setItem("savedNotes", notepad.innerText);
});
