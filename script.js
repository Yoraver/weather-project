//API key
const apiKey = '235cb84657d04293b6b211936242908';

//DOM Elements
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const locationButton = document.getElementById('location-button');
const weatherData = document.getElementById('weather-data');
const extendedForecast = document.getElementById('extended-forecast');
const recentCitiesContainer = document.getElementById('recent-cities-container');
const recentCities = document.getElementById('recent-cities');

//Eent Listenser
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    } else {
        alert('Please enter a city name.');
    }
});

locationButton.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            getWeatherByLocation(position.coords.latitude, position.coords.longitude);
        }, () => {
            alert('Unable to retrieve your location.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

recentCities.addEventListener('change', () => {
    const city = recentCities.value;
    if (city) {
        getWeatherByCity(city);
    }
});

//Fetch weather data with CIty Name
function getWeatherByCity(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5`)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            addRecentCity(city);
        })
        .catch(error => handleError(error));
}

//Fetch weather with current location
function getWeatherByLocation(lat, lon) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=5`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => handleError(error));
}

//weather data
function displayWeather(data) {
    const current = data.current;
    const forecast = data.forecast.forecastday;

    weatherData.innerHTML = `
        <h2 class="text-xl font-bold mb-4 text-blue-600">${data.location.name}, ${data.location.country}</h2>
        <p class="text-lg">${current.condition.text}</p>
        <img src="${current.condition.icon}" alt="${current.condition.text}" class="mx-auto">
        <p>Temperature: ${current.temp_c}°C</p>
        <p>Humidity: ${current.humidity}%</p>
        <p>Wind Speed: ${current.wind_kph} km/h</p>
    `;

    extendedForecast.innerHTML = forecast.map(day => `
        <div class="bg-gray-100 p-4 rounded-md shadow-md">
            <h3 class="font-bold text-blue-600">${day.date}</h3>
            <p>${day.day.condition.text}</p>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" class="mx-auto">
            <p>Max Temp: ${day.day.maxtemp_c}°C</p>
            <p>Min Temp: ${day.day.mintemp_c}°C</p>
            <p>Wind Speed: ${day.day.maxwind_kph} km/h</p>
            <p>Humidity: ${day.day.avghumidity}%</p>
        </div>
    `).join('');
}

//errors
function handleError(error) {
    alert('Error fetching weather data. Please try again later.');
}


//Add city to recent cities
function addRecentCity(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem('recentCities', JSON.stringify(cities));
    }
    updateRecentCitiesDropdown();
}

//update recent cities
function updateRecentCitiesDropdown() {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    recentCities.innerHTML = cities.map(city => `<option value="${city}">${city}</option>`).join('');
    if (cities.length > 0) {
        recentCitiesContainer.classList.remove('hidden');
    } else {
        recentCitiesContainer.classList.add('hidden');
    }
}

document.addEventListener('DOMContentLoaded', updateRecentCitiesDropdown);
