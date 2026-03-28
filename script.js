//clock and date----------------------------------
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
//---------------------------------------------------------
// Header--------------------------------------------------

const header = document.getElementById("headerInput");
const savedHeader = localStorage.getItem("headerTitle");
header.contentEditable = "true";
if (savedHeader) header.textContent = savedHeader;

header.addEventListener("input", () => {
  localStorage.setItem("headerTitle", header.textContent);
});
//--------------------------------------------------------
// Links--------------------------------------------------

const addLinkBtn = document.getElementById("addLinkBtn");
const popup = document.getElementById("popup");

// add link button opens popup window:
addLinkBtn.addEventListener("click", (e) => {
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

const linkList = document.getElementById("linkList");

// save links to localStorage:
function saveLinks() {
  const links = [];
  document.querySelectorAll(".bigLink").forEach((link) => {
    links.push({
      url: link.querySelector("a").href,
      title: link.querySelector("a").textContent,
      icon: link.querySelector("img").src,
    });
  });
  localStorage.setItem("savedLinks", JSON.stringify(links));
}

// create big link:
function createLinkElement(url, title, icon) {
  const newBigLink = document.createElement("div");
  newBigLink.classList.add("bigLink");
  newBigLink.innerHTML = `
    <div class="bigLinkText">
      <img src="${icon}">
      <a href="${url}" target="_blank">${title}</a>
    </div>
    <div class="bigLinkRemoveButton">
      <button class="removeBtn">-</button>
    </div>
  `;
  // remove bigLink:
  newBigLink.querySelector(".removeBtn").addEventListener("click", (e) => {
    e.preventDefault();
    newBigLink.remove();
    saveLinks();
  });
  return newBigLink;
}
// get saved links from localStorage:
const savedLinks = JSON.parse(localStorage.getItem("savedLinks")) || [];
savedLinks.forEach(({ url, title, icon }) => {
  linkList.appendChild(createLinkElement(url, title, icon));
});

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const link = linkInput.value.trim();
  const title = titleInput.value.trim();

  if (!link || !title) {
    return;
  }
  // make sure the link starts with http/ https:
  let completeUrl;
  if (link.startsWith("http")) {
    completeUrl = link;
  } else {
    completeUrl = "https://" + link;
  }
  // use url to get icon from google:
  const domain = new URL(completeUrl).hostname;
  const urlIcon = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  // save links in local storage:
  linkList.prepend(createLinkElement(completeUrl, title, urlIcon));
  saveLinks();

  // reset and close popup:
  linkInput.value = "";
  titleInput.value = "";
  popup.classList.add("hidden");
});

//---------------------------------------------------
// news----------------------------------------------
// const apiKey = "5cfaef00c1985477323a295a214f1bbc";
// async function fetchNews() {
//   // const apiKey = import.meta.env.API_KEY;
//   try {
//     const response = await fetch(
//       `https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=us,se&limit=10`,
//     );

//     if (!response.ok) {
//       throw new Error("Kunde inte hämta data");
//     }

//     const data = await response.json();
//     createNewsList(data.data);
//   } catch (error) {
//     console.error("Kunde inte hämta nyheter:", error);
//   }
// }

// function createNewsList(articles) {
//   const newsList = document.getElementById("newsList");

//   newsList.innerHTML = "";

//   articles.forEach((article) => {
//     const articleDiv = document.createElement("div");
//     articleDiv.classList.add("articleDiv");

//     articleDiv.innerHTML = `
//     ${article.image ? `<img src="${article.image}" alt="${article.title}">` : ""}
//       <a href="${article.url}" target="_blank">${article.title}</a>
//       <p>- ${article.source}</p>
//     `;
//     newsList.appendChild(articleDiv);
//   });
// }
// document.getElementById("refreshBtn").addEventListener("click", (e) => {
//   e.preventDefault();
//   fetchNews();
// });
// fetchNews();
//---------------------------------------------------
// dad-jokes-----------------------------------------
const dadJokeUrl = "https://icanhazdadjoke.com/";
const dadJokeBox = document.getElementById("dadJokeBox");
const refreshBtn = document.getElementById("refreshBtn");
const savedJoke = localStorage.getItem("savedJoke");

async function fetchDadJoke() {
  try {
    const response = await fetch(dadJokeUrl, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Kunde inte hämta data");
    }

    const data = await response.json();
    createDadJoke(data);
  } catch (error) {
    console.error("Kunde inte hämta skämt:", error);
    dadJokeBox.textContent = "Kunde inte hämta skämt, försök igen.";
  }
}
function createDadJoke(dadJoke) {
  dadJokeBox.innerHTML = "";

  const jokeDiv = document.createElement("div");
  jokeDiv.classList.add("jokeDiv");
  jokeDiv.innerHTML = `
    <p>${dadJoke.joke}</p>
    `;

  dadJokeBox.appendChild(jokeDiv);
  localStorage.setItem("savedJoke", dadJoke.joke);
}
if (savedJoke) {
  createDadJoke({ joke: savedJoke });
} else {
  fetchDadJoke();
}
refreshBtn.addEventListener("click", (e) => {
  e.preventDefault();
  fetchDadJoke();
});

//---------------------------------------------------
// weather-------------------------------------------
const weatherURL = "https://api.open-meteo.com/v1/";
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
  // get the users position:
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const response = await fetch(
          `${weatherURL}forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3`,
        );

        if (!response.ok) {
          throw new Error("Kunde inte hämta data");
        }

        const data = await response.json();
        createList(data.daily);
      } catch (error) {
        console.error("Kunde inte hämta väder:", error);
        weatherList.textContent = "Kunde inte hämta data, försök igen.";
      }
    },
    (error) => {
      console.error("Kunde inte hämta position:", error);
      weatherList.textContent = "Kunde inte hämta din position.";
    },
  );
}
function createList(dailyWeather) {
  weatherList.innerHTML = "";

  dailyWeather.time.forEach((date, index) => {
    const code = dailyWeather.weather_code[index];
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
    <span class="weatherTemp">${dailyWeather.temperature_2m_max[index]}° </span> 
    <span class="weatherText">${text} </span></div></div>`;
    // lägga till nån mer funktion om man klickar?
    weatherList.appendChild(li);
  });
}
fetchForecast();
//------------------------------------------------
// notes -----------------------------------------
const notepad = document.getElementById("notes");
const savedNotes = localStorage.getItem("savedNotes");

if (savedNotes) {
  notepad.value = savedNotes;
}
notepad.addEventListener("input", () => {
  localStorage.setItem("savedNotes", notepad.value);
});

//-----------------------------------------------
// change background-----------------------------

const unsplashKey = "tT4cYdP0RO3ZN2TWA9Hrm52iGtGf_YCURYi59Ch-0Lk";

async function fetchImage() {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?client_id=${unsplashKey}`,
  );

  const data = await response.json();

  const imgUrl = data.urls.regular;
  setBackground(imgUrl);
  localStorage.setItem("savedBackground", imgUrl); // spara
}

function setBackground(url) {
  document.body.style.backgroundImage = `url(${url})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundAttachment = "fixed";
}

// get saved background:
const savedBackground = localStorage.getItem("savedBackground");
if (savedBackground) {
  setBackground(savedBackground);
}

document.getElementById("updateImgBtn").addEventListener("click", (e) => {
  e.preventDefault();
  fetchImage();
});
