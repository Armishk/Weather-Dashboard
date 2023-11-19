
  function initPage() {
    var cityEl = document.getElementById("enter-city");
    var nameEl = document.getElementById("city-name");
    var searchEl = document.getElementById("search-button");
    var currentPicEl = document.getElementById("current-icon");
    var todayweatherEl = document.getElementById("today-weather");
    var fivedayEl = document.getElementById("5-day-header");
    var currentTempEl = document.getElementById("temp");
    var currentHumidityEl = document.getElementById("humidity");
    var currentWindEl = document.getElementById("wind");
    var historyEl = document.getElementById("history");
    var searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    
    var APIKey = "19ff27d58878fbfbde8d49f03af51948";
    // 19ff27d58878fbfbde8d49f03af51948

    var city;
    
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

    fetch(queryURL)

    function getWeather(cityName) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {

                todayweatherEl.classList.remove("d-none");

                var currentDate = new Date(response.data.dt * 1000);
                var day = currentDate.getDate();
                var month = currentDate.getMonth() + 1;
                var year = currentDate.getFullYear();
                nameEl.textContent = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                var weatherPic = response.data.weather[0].icon;
                currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@4x.png");
                currentPicEl.setAttribute("alt", response.data.weather[0].description);
                currentTempEl.textContent = "Temperature: " + k2f(response.data.main.temp) + " &#176F";
                currentHumidityEl.textContent = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.textContent = "Wind: " + response.data.wind.speed + " MPH";
                
                var cityID = response.data.id;
                var forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                axios.get(forecastQueryURL)
                    .then(function (response) {
                        fivedayEl.classList.remove("d-none");
                        
        
                        var forecastEls = document.querySelectorAll(".forecast");
                        for (i = 0; i < forecastEls.length; i++) {
                            forecastEls[i].textContent = "";
                            var forecastIndex = i * 8 + 4;
                            var forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                            var forecastDay = forecastDate.getDate();
                            var forecastMonth = forecastDate.getMonth() + 1;
                            var forecastYear = forecastDate.getFullYear();
                            var forecastDateEl = document.createElement("p");
                            forecastDateEl.setAttribute("class", "mt-3 mb-0 forecast-date");
                            forecastDateEl.textContent = forecastMonth + "/" + forecastDay + "/" + forecastYear;
                            forecastEls[i].append(forecastDateEl);

                            var forecastWeatherEl = document.createElement("img");
                            forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                            forecastWeatherEl.setAttribute("alt", response.data.list[forecastIndex].weather[0].description);
                            forecastEls[i].append(forecastWeatherEl);
                            var forecastTempEl = document.createElement("p");
                            forecastTempEl.textContent = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + " &#176F";
                            forecastEls[i].append(forecastTempEl);
                            var forecastHumidityEl = document.createElement("p");
                            forecastHumidityEl.textContent = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                            forecastEls[i].append(forecastHumidityEl);
                        }
                    })
            });
    }

    searchEl.addEventListener("click", function () {
        var searchTerm = cityEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        renderSearchHistory();
    })

    function k2f(K) {
        return Math.floor((K - 273.15) * 1.8 + 32);
    }

    function renderSearchHistory() {
        historyEl.textContent = "";
        for (let i = 0; i < searchHistory.length; i++) {
            var historyItem = document.createElement("input");
            historyItem.setAttribute("type", "text");
            historyItem.setAttribute("readonly", true);
            historyItem.setAttribute("class", "form-control d-block bg-white");
            historyItem.setAttribute("value", searchHistory[i]);
            historyItem.addEventListener("click", function () {
                getWeather(historyItem.value);
            })
            historyEl.append(historyItem);
        }
    }

    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }
    
}

initPage();