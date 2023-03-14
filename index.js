// Set current temp after calling API

const playaDelCarmenCoords = ["20.63", "-87.08"];

const getTempUrl = (lat,lon) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current_weather=true`;

let currentCTemp;

fetch(getTempUrl(playaDelCarmenCoords[0],playaDelCarmenCoords[1]))
  .then((response) => response.json())
  .then((data) => {
    currentCTemp = data.current_weather.temperature;
    document.getElementById("temp").innerText = `${currentCTemp}°C`;
  });

// Add toggle  button functionality

const toggleButtons = document.getElementsByClassName("toggle-button");

for (let i = 0; i < toggleButtons.length; i++) {
  toggleButtons[i].addEventListener("click", handleUnitChange);
}

function handleUnitChange(e) {
  const clickedElement = e.target;
  console.log(clickedElement);

  const hasUnitEnabled = clickedElement.classList.contains("unit-enabled");

  if (hasUnitEnabled) {
    return;
  }

  const clickedId = clickedElement.id;
  let newTempValue = undefined;
  let otherUnit = undefined;

  if (clickedId == "celsius-button") {
    otherUnit = document.getElementById("fahrenheit-button");

    const currentTempValue = document.getElementById("temp").innerText;

    const newTemp = round(farToCelcius(
        currentTempValue.substring(0, currentTempValue.length - 2)
      ), 1);
      
    newTempValue = `${newTemp}°C`;
  } else if (clickedId == "fahrenheit-button") {
    otherUnit = document.getElementById("celsius-button");
    const currentTempValue = document.getElementById("temp").innerText;
    
    const newTemp = round(celciusToFar(
        currentTempValue.substring(0, currentTempValue.length - 2)
      ), 1);
    newTempValue = `${newTemp}°F`;
  }

  document.getElementById("temp").innerText = newTempValue;
  clickedElement.classList.add("unit-enabled");
  otherUnit.classList.remove("unit-enabled");
}

const celciusToFar = (cDeg) => {
  return cDeg * 1.8 + 32;
};

const farToCelcius = (fDeg) => {
  return ((fDeg - 32) * 5) / 9;
};

function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}
