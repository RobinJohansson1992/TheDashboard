//clock and date-------------------------
function TimeNow() {
  const d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();

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
  setTimeout(TimeNow, 1000);
}

// Header------------------------------
const header = document.getElementById("headerInput");
const savedHeader = localStorage.getItem("headerTitle");

if (savedHeader) header.value = savedHeader;

header.addEventListener("change", () => {
  localStorage.setItem("headerTitle", header.value);
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
