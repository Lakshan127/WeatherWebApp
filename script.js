function getWeather() {
    const APIkey = process.env.API_KEY ; // Fallback für lokale Entwicklung
    const stadt = document.getElementById("stadt").value.trim();

    if (!stadt) {
        alert("Bitte geben Sie eine Stadt ein.");
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${stadt}&appid=${APIkey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${stadt}&appid=${APIkey}&units=metric`;

    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWetter(data);
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Wetterdaten: ", error);
            alert("Fehler beim Abrufen der Wetterdaten. Bitte versuchen Sie es erneut.");
        });

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayStündlichVorhersage(data);
        })
        .catch(error => {
            console.error("Fehler beim Abrufen der Wettervorhersage: ", error);
            alert("Fehler beim Abrufen der Wettervorhersage. Bitte versuchen Sie es erneut.");
        });
}

function displayWetter(data) {
    const tempDivInfo = document.getElementById("temp-div");
    const weatherInfoDiv = document.getElementById("wetter-info");
    const weatherIcon = document.getElementById("wetter-icon");

    tempDivInfo.innerHTML = "";
    weatherInfoDiv.innerHTML = "";

    if (data.cod === "404") {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempDivInfo.innerHTML = `<p>${temperature} °C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}, ${description}</p>`;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = "block";
    }
}

function displayStündlichVorhersage(hourlyData) {
    const hourlyForecastDiv = document.getElementById("Stündliche-Vorhersage");
    hourlyForecastDiv.innerHTML = "";

    const next24H = hourlyData.list.slice(0, 8);

    next24H.forEach(item => {
        const date = new Date(item.dt * 1000);
        const hours = date.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHTML = `
            <div class="hourly-item">
                <span>${hours}:00</span>
                <img src="${iconUrl}" alt="${item.weather[0].description}">
                <span>${temperature} °C</span>
            </div>`;

        hourlyForecastDiv.innerHTML += hourlyItemHTML;
    });
}
