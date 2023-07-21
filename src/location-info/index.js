/* ==== GLOBAL VARIABLES ==== */
let searchResults = [];
let searchResultToAdd = {};

/* ==== DOM ELEMENTS ==== */
const searchContainer = document.querySelector(".search-container");
const searchbar = document.getElementById("searchbar");
const searchButton = document.getElementById("search-button");
const searchResultsContainer = document.querySelector(
  ".search-results-container"
);
const searchResultsLoadingDiv = document.getElementById(
  "search-results-loading"
);
const searchResultsUl = document.getElementById("search-results");
const errorMessageDiv = document.getElementById("message");
const locationsDiv = document.getElementById("locations");

/* ==== EVENT LISTENERS ==== */
searchbar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchLocation(searchbar.value);
  }
});

searchButton.addEventListener("click", () => {
  searchLocation(searchbar.value);
});

// hides search results on click away
document.addEventListener("click", (event) => {
  const isClickOutside = !searchContainer.contains(event.target);

  if (isClickOutside) {
    closeSearchResultsBox();
  }
});

/**
 * Populates search results box.
 * Called on confirmation of search button or enter in search input.
 */
async function searchLocation(value) {
  // hides error message if present from previous search
  hideErrorMessage();
  openSearchResultsBox();

  try {
    const searchResults = await fetchSearchResults(value);
    populateSearchResults(searchResults);
  } catch (e) {
    showErrorMessage(e.message);
    closeSearchResultsBox();

    console.error(e);
  }
}

function closeSearchResultsBox() {
  searchResultsLoadingDiv.classList.add("hidden");
  searchResultsUl.innerHTML = "";
  searchResultsContainer.classList.add("hidden");
}

function showErrorMessage(message) {
  errorMessageDiv.textContent = message;
  errorMessageDiv.classList.add("error");
  errorMessageDiv.classList.remove("hidden");
}

/**
 * Fetches search result by calling the netlify serverless function
 * @param value : Search term
 * @returns Array of search results
 */
async function fetchSearchResults(value) {
  const response = await fetch("/.netlify/functions/searchLocation", {
    method: "POST",
    body: JSON.stringify({
      searchTerm: value,
    }),
  });

  const json = await response.json();

  return json.data;
}

function hideErrorMessage() {
  errorMessageDiv.classList.add("hidden");
  errorMessageDiv.classList.remove("error");
  errorMessageDiv.textContent = "";
}

function openSearchResultsBox() {
  searchResultsContainer.classList.remove("hidden");
  searchResultsUl.innerHTML = "";
  searchResultsLoadingDiv.classList.remove("hidden");
}

/**
 * Populates search result box
 * @param results : Search results reponse object from API
 */
function populateSearchResults(results) {
  searchResultsLoadingDiv.classList.add("hidden");

  // handle no results
  if (results.length === 0) {
    searchResultsUl.innerHTML =
      "<p class='no-locations'>No locations found.</p>";
  }

  // save search results in global object
  searchResults = results.map((s, i) => ({
    id: `location-${i}`,
    name: s.name,
    state: s.state,
    country: s.country,
    lat: s.latitude,
    long: s.longitude,
  }));

  renderSearchResults(searchResults);
}

function renderSearchResults(searchResults) {
  searchResults.forEach((s, i) => {
    const l = searchResults.length;
    searchResultsUl.innerHTML += renderSearchResultLi(s, i, l);
  });

  searchResultsContainer.appendChild(searchResultsUl);

  // use capture ensure only one event listener added for whole list
  searchResultsUl.addEventListener("click", addLocation, true);
}

function renderSearchResultLi(searchResult, index, length) {
  const id = searchResult.id;
  const borderBottom = `${index === length - 1 ? "border-bottom-none" : ""}`;
  const name = searchResult.name;
  const state = `${searchResult.state ? ", " + searchResult.state : ""}`;
  const country = searchResult.country;

  return `<li id="${id}" class="search-result ${borderBottom}"><span> ${name} ${state}, ${country} </span> </li>`;
}

/**
 * Adds a location card to locations.
 * Called when the add button of a search result is pressed.
 * @param {*} e
 */
async function addLocation(e) {
  const target = e.target.closest("li");
  closeSearchResultsBox();
  searchbar.value = "";

  // Start locations loading
  locationsDiv.innerHTML += renderLoading();

  // set global object
  searchResultToAdd = searchResults.find((s) => s.id === target.id);

  // call netlify function with paramters lat, lon, return results
  const timeAndTemp = await fetchTimeAndTemp(searchResults);

  searchResultToAdd.temp = timeAndTemp[0].value.temp;
  searchResultToAdd.time = `${timeAndTemp[1].value.hour}:${timeAndTemp[1].value.minute}`;

  locationsDiv.removeChild(document.getElementById("loading-card"));
  locationsDiv.innerHTML += renderNewLocation(searchResultToAdd);

  // UNITS
  for (const btn of document.querySelectorAll(
    ".temp-format-buttons > .unit-button"
  )) {
    btn.addEventListener("click", handleTempToggle);
  }

  for (const btn of document.querySelectorAll(
    ".time-format-buttons > .unit-button"
  )) {
    btn.addEventListener("click", handleTimeToggle);
  }

  searchResultToAdd = {};
}

/**
 * Calls the netlify serveless function that fetches time and temp of a location
 * @returns
 */
async function fetchTimeAndTemp() {
  const response = await fetch("/.netlify/functions/fetchTimeAndTemp", {
    method: "POST",
    body: JSON.stringify({
      lat: searchResultToAdd.lat,
      long: searchResultToAdd.long,
    }),
  });

  const json = await response.json();
  console.log(json);

  return json.data;
}

/**
 * Returns the html code for a new location
 * @param {*} location
 * @returns
 */
const renderNewLocation = (
  location
) => `<div id=${location.id} class="location">
<div class="title-box">
  <h3 class="location-title">${location.name}</h3>
</div>
<div class="fields">
  <div class="field-box">
    <span class="field-label">TIME</span
    ><span id="time" class="field-value">${location.time}</span>
    <div class="time-format-buttons group-buttons-box">
      <span
        id="12h-button"
        class="unit-button right-border-none"
      >
        12 </span
      ><span id="24h-button" class="unit-button left-border unit-enabled"
        >24</span
      >
    </div>
  </div>
  <div class="field-box">
    <span class="field-label">TEMP</span>
    <span id="temp" class="field-value">${location.temp}°C</span>
    <div class="temp-format-buttons group-buttons-box">
      <span id="celsius-button" class="unit-button right-border-none unit-enabled">°C </span>
      <span id="fahrenheit-button" class="unit-button left-border">°F</span>
    </div>
  </div>
</div>
</div>`;

const renderLoading = () => `<div id="loading-card" class="">
<div class="loading-indicator">
  <div class="dot dot-1"></div>
  <div class="dot dot-2"></div>
  <div class="dot dot-3"></div>
</div>
</div>`;

/**
 * Handles temperature unit toggle
 * @param {} e
 */
function handleTempToggle(e) {
  const clickedUnit = e.target;

  if (clickedUnit.classList.contains("unit-enabled")) {
    return;
  }

  const otherUnit =
    clickedUnit.id === "celsius-button"
      ? clickedUnit.nextElementSibling
      : clickedUnit.previousElementSibling;

  otherUnit.classList.remove("unit-enabled");
  clickedUnit.classList.add("unit-enabled");

  // 13°C
  const tempString = clickedUnit.parentElement.previousElementSibling.innerText;
  const tempDigit = tempString.substring(0, tempString.length - 2);

  let newTempString;

  if (clickedUnit.id === "celsius-button") {
    const newDigit = Math.round(farToCelcius(tempDigit));
    newTempString = `${newDigit}°C`;
  } else {
    const newDigitValue = Math.round(celciusToFar(tempDigit));
    newTempString = `${newDigitValue}°F`;
  }

  const tempElement = e.target.parentElement.previousElementSibling;
  tempElement.innerText = newTempString;
}

const celciusToFar = (celsius) => celsius * 1.8 + 32;
const farToCelcius = (far) => ((far - 32) * 5) / 9;

/**
 * Handles time format toggle from between 12 and 24 format
 * @param {*} e
 * @returns
 */
function handleTimeToggle(e) {
  const clickedUnit = e.target;

  if (clickedUnit.classList.contains("unit-enabled")) {
    return;
  }

  const otherUnitButton =
    clickedUnit.id === "12h-button"
      ? clickedUnit.nextElementSibling
      : clickedUnit.previousElementSibling;

  const currentTimeString =
    clickedUnit.parentElement.previousElementSibling.innerText;

  try {
    let newTimeString;

    if (clickedUnit.id === "12h-button") {
      newTimeString = from24to12(currentTimeString);
    } else {
      newTimeString = from12to24(currentTimeString);
    }
    otherUnitButton.classList.remove("unit-enabled");
    clickedUnit.classList.add("unit-enabled");
    const timeValueEl = clickedUnit.parentElement.previousElementSibling;
    timeValueEl.innerText = newTimeString;
  } catch (e) {
    console.error(e);
  }
}

/**
 * Coverts a time string from 12 to 24 hour format.
 * @param {*} timeString: ex '08:55 am'
 * @returns
 */
function from12to24(timeString) {
  let hour = parseInt(timeString.slice(0, 2));
  const amPm = timeString.slice(timeString.length - 2, timeString.length);

  if (
    timeString.length !== 8 ||
    hour < 0 ||
    hour > 12 ||
    (amPm !== "am" && amPm !== "pm")
  ) {
    throw new Error("Time string is invalid.");
    // 1-11 am and 12pm are left unchanged
  } else if (hour === 12 && amPm === "am") {
    hour = 0;
  } else if (amPm === "pm" && hour < 12) {
    hour += 12;
  }

  const hourString = hour === 0 || hour < 10 ? "0" + hour : hour.toString();

  return `${hourString}${timeString.slice(2, timeString.length - 2)}`;
}

/**
 * Coverts a time string from 24 to 12 hour format.
 * @param {*} timeString: ex '08:55'
 * @returns
 */
function from24to12(timeString) {
  let hour = parseInt(timeString.slice(0, 2));
  let amPm = "";

  if (timeString.length !== 5 || hour < 0 || hour > 23) {
    throw new Error("Time string is invalid.");
  } else if (hour === 0) {
    hour = 12;
    amPm = "am";
  } else if (hour >= 1 && hour <= 12) {
    if (hour === 12) {
      amPm = "pm";
    } else {
      amPm = "am";
    }
  } else if (hour > 12 && hour <= 23) {
    hour -= 12;
  }

  const hourString = hour === 0 || hour < 10 ? "0" + hour : hour.toString();

  return `${hourString}${timeString.slice(2, timeString.length)} ${amPm}`;
}
