## Intro

Welcome :)

This repository contains a web application which displays the weather and time of an added location.

It is built with HTML, CSS and vanilla JS.

The live demo can be found [here](https://locations-info.netlify.app/).

In order to use the app you first need to add

To start the development server you need to add a `.env` file at the root of the project with the Api key from the [Ninja API](https://api-ninjas.com/) like this:

```
API_KEY=[YOUR API KEY]
```
Then run:

```bash
npm i
netlify dev
```

Or you can just open the `index.html` located at `src/locatios-info` file in your browser.

## Locations info

[Ninja API](https://api-ninjas.com/) is used for geocoordinates, time and temperature.

The app is deployed on Netlify. In addition, it uses Netlify serverless functions to make API calls that hide the API key and does not use a dedicated server. Here you can learn [more](https://www.netlify.com/blog/intro-to-serverless-functions/).

### Features

- User can add a location by typing the name of location in a searchbar.
- User can select a location from the search bar which will be added in the locations card list.
- Each card shows the location's temperature and time.
- User can toggle the temperature unit between celsius and fahrenheit.
- User can toggle the time unit between the 12 and 24 hour format.

## Weather card (first draft of Locations Info)

A simple web application which displays the current temperature of city Playa del Carmen, in Mexico.

Built with HTML,CSS and JS.

[Open meteo](https://open-meteo.com/) API is used for getting the current temperature.

### Features

- A card which displays the current temperature in Playa del Carmen, Mexico.
- User can toggle the temperature unit between celsius and fahrenheit.
