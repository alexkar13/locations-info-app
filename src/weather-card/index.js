// TEMPERATURE
const getApiUrl = (lat, lon) =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m&current_weather=true`;

fetch(getApiUrl("20.63", "-87.08"))
  .then((response) => response.json())
  .then((data) => {
    $("#temp").text(`${data.current_weather.temperature}°C`);
  });

// UNITS
for (const btn of $(".unit-button")) {
  btn.addEventListener("click", handleTempUnitChange);
}

function handleTempUnitChange(e) {
  const clickedUnit = e.target;

  if (clickedUnit.classList.contains("unit-enabled")) {
    return;
  }

  const otherUnitButton =
    clickedUnit.id === "celsius-button"
      ? clickedUnit.nextElementSibling
      : clickedUnit.previousElementSibling;

  otherUnitButton.classList.remove("unit-enabled");
  clickedUnit.classList.add("unit-enabled");

  const newValue = calculateNewTempValue(clickedUnit.id);
  $("#temp")[0].innerText = newValue;
}

function calculateNewTempValue(unitId) {
  const currentValue = $("#temp").text();
  const currentDigitValue = currentValue.substring(0, currentValue.length - 2);

  if (unitId === "celsius-button") {
    const newDigitValue = round(farToCelcius(currentDigitValue), 1);
    return `${newDigitValue}°C`;
  } else {
    const newDigitValue = round(celciusToFar(currentDigitValue), 1);
    return `${newDigitValue}°F`;
  }
}

function round(value, precision) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

const celciusToFar = (celsius) => celsius * 1.8 + 32;

const farToCelcius = (far) => ((far - 32) * 5) / 9;
