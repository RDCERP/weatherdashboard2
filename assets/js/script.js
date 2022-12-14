// Create a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.
// Use the OpenWeather API to retrieve weather data for cities. The app will run in the browser and feature dynamically updated HTML and CSS.
// When I view the weather dashboard, I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index.
// When I view future weather conditions for that city, I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity.
// When I click on a city in the search history, I am again presented with current and future conditions for that city.



// Global Variables
var city = "";                                                              // variable to hold the city list
var cityList = [];                                                          // variable to hold the city list element
var cityListEl = document.querySelector("#searchHistory");                     
var citySearchEl = document.querySelector("#citySearch");
var citySearchFormEl = document.querySelector("#city-search-form");
var currentWeather = document.querySelector("#currentWeather");
var currentCityEl = document.querySelector("#cityName");
var currentTempEl = document.querySelector("#currentTemp");
var currentHumidityEl = document.querySelector("#currentHumidity");
var currentWindEl = document.querySelector("#currentWind");
var currentUvEl = document.querySelector("#currentUV");
var forecastEl = document.querySelector("#fiveDayForecast");
var forecastTitle = document.querySelector('#forecast-title')
var forecastWindEl = document.querySelector("#forecastWind");
// var forecastDateEl = document.querySelector("#forecast-date");
// var forecastTempEl = document.querySelector("#forecast-temp");
// var forecastHumidityEl = document.querySelector("#forecast-humidity");
// var forecastIconEl = document.querySelector("#forecast-icon");

// API Key
var apiKey = "a21465154dcfd209d235adf77262204e";
let cityExist = false;
// function to get the current weather
var getCurrentWeather = function (city) {
  // format the weather api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";

  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayCurrentWeather(data, city);
        
          saveCityList();
          renderCityList();
          currentWeather.style.border = "2px solid grey";
          cityListEl.style.borderTop = "2px solid grey";
        });
      } else {
        alert("Error: " + response.statusText);
         
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");

    });
};

// function to get the forecast
var getForecast = function (city) {
  // format the weather api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayForecast(data);
          console.log(data)
        
        });
      } else {
        alert("Error: " + response.statusText);
       
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

// function to get the UV index
var getUvIndex = function (lat, lon) {
  // format the weather api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;

  // make a request to the url
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          displayUvIndex(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

// function to get the city list
var getCityList = function () {
  // get city list from local storage
  var storedCityList = JSON.parse(localStorage.getItem("cityList"));

  // if cities were retrieved from localStorage, update the city list array to it
  if (storedCityList !== null) {
    cityList = storedCityList;
  }

  // render city list to the DOM
  renderCityList();
};

// function to save the city list
var saveCityList = function () {
  // set new array to local storage

  localStorage.setItem("cityList", JSON.stringify(cityList));

};

// function to render the city list
var renderCityList = function () {
  // clear city list element
  cityListEl.innerHTML = "";

  // render a new li for each city
  for (var i = 0; i < cityList.length; i++) {
    var city = cityList[i];
// if( storedCityList.includes(city) === false){

    var li = document.createElement("li");
    li.textContent = city;
    li.setAttribute("data-index", i);

    // var button = document.createElement("button");
    // button.textContent = "Search";

    // li.appendChild(button);
    cityListEl.appendChild(li);
  }
};

// function to render the current weather
var displayCurrentWeather = function (weather, searchCity) {
  // clear old content
  currentCityEl.textContent = "";
  currentTempEl.textContent = "";
  currentHumidityEl.textContent = "";
  currentWindEl.textContent = "";
  currentUvEl.textContent = "";


  // format the date
  var currentDate = new Date(weather.dt * 1000);
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  currentDate = month + "/" + day + "/" + year;

  // create html content for current weather
  var cityNameEl = document.createElement("span");
  cityNameEl.textContent = searchCity + " (" + currentDate + ") ";

  var weatherIcon = document.createElement("img");
  weatherIcon.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" + weather.weather[0].icon + ".png"
  );
  cityNameEl.appendChild(weatherIcon);

  var temperatureEl = document.createElement("span");
  temperatureEl.textContent = "Temperature: " + weather.main.temp + " ??F";
  temperatureEl.classList = "list-group-item";

  var humidityEl = document.createElement("span");
  humidityEl.textContent = "Humidity: " + weather.main.humidity + "%";
  humidityEl.classList = "list-group-item";

  var windSpeedEl = document.createElement("span");
  windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
  windSpeedEl.classList = "list-group-item";

  var UVEl = document.createElement("span");
UVEl.textContent = "UV: " + getUvIndex(weather.coord.lat, weather.coord.lon);
  UVEl.classList = "list-group-item";


  // append to page
  currentCityEl.appendChild(cityNameEl);
  currentTempEl.appendChild(temperatureEl);
  currentHumidityEl.appendChild(humidityEl);
  currentWindEl.appendChild(windSpeedEl);
 //   currentUvEl.appendChild(UVEl);

  // get the UV index
    // getUvIndex(weather.coord.lat, weather.coord.lon);
};

// function to render the forecast
var displayForecast = function (weather) {
  // clear old content
  forecastEl.textContent = "";
    forecastTitle.textContent = "5-Day Forecast:";

  // format the date
 

  // create html content for forecast
  for (var i = 0; i < weather.list.length; i++) {
    // only look at forecasts around 3:00pm
    if (weather.list[i].dt_txt.indexOf("15:00:00") !== -1) {
      // create html elements for a bootstrap card
      var colEl = document.createElement("div");
      colEl.classList = "col-md-2";

      var cardEl = document.createElement("div");
      cardEl.classList = "card bg-primary text-white";

      var bodyEl = document.createElement("div");
      bodyEl.classList = "card-body p-2";

      

      var weatherIcon = document.createElement("img");
      weatherIcon.setAttribute(
        "src",
        "https://openweathermap.org/img/wn/" + weather.list[i].weather[0].icon + ".png"
      );
 
      var currentDate = new Date( weather.list[i].dt_txt);
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      currentDate = month + "/" + day + "/" + year;

      
      var titleEl = document.createElement("h5");
      titleEl.classList = "card-title";
      titleEl.textContent = currentDate
      console.log(weather.list[i].dt_txt)

      var tempEl = document.createElement("p");
      tempEl.classList = "card-text";
      tempEl.textContent = "Temp: " + weather.list[i].main.temp_max + " ??F";

      var humidityEl = document.createElement("p");
      humidityEl.classList = "card-text";
      humidityEl.textContent = "Humidity: " + weather.list[i].main.humidity + "%";

      var windSpeedEl = document.createElement("p");
        windSpeedEl.classList = "card-text";
        windSpeedEl.textContent = "Wind Speed: " + weather.list[i].wind.speed + " MPH";

      // merge together and put on page
      colEl.appendChild(cardEl);
      cardEl.appendChild(bodyEl);
      bodyEl.appendChild(titleEl);
      bodyEl.appendChild(weatherIcon);
      bodyEl.appendChild(tempEl);
      bodyEl.appendChild(humidityEl);
      bodyEl.append(windSpeedEl);
      forecastEl.appendChild(colEl);
    }
  }
};

// function to render the UV index
// var displayUvIndex = function (index) {
//   var uvIndexEl = document.createElement("span");
//   uvIndexEl.textContent = index.value;

//   if (index.value <= 2) {
//     uvIndexEl.classList = "favorable";
//   } else if (index.value > 2 && index.value <= 8) {
//     uvIndexEl.classList = "moderate";
//   } else if (index.value > 8) {
//     uvIndexEl.classList = "severe";
//   }

//   currentUvEl.appendChild(uvIndexEl);
// };

// function to handle the search form submit
var formSubmitHandler = function (event) {
  event.preventDefault();
  console.log(citySearchEl.value)
  // get value from input element
  var city = citySearchEl.value.trim();

  if (city) {
    
    
    getCurrentWeather(city);
      getForecast(city);
      getCityList();
    citySearchEl.value = "";
        
    
    // add new city to city list array, clear the old list, update the list array, save to local storage, re-render the list
    if(cityList.includes(city) === false){
        cityList.push(city);
       
    }
    cityListEl.innerHTML = "";

    // saveCityList(city);
    // renderCityList();

  } else {
    alert("Please enter a City");
  }
  
};

// function to handle the city list click
var cityClickHandler = function (event) {
  var element = event.target;
console.log("got here")
  if (element.matches("li") === true) {
    var index = element.getAttribute("data-index");
    getCurrentWeather(cityList[index]);
    getForecast(cityList[index]);
  }
};

// function to handle the clear history button click
var clearHistoryHandler = function (event) {
  cityListEl.innerHTML = "";
  cityList = [];
  saveCityList();
};

// function to handle the page load
var pageLoadHandler = function () {
  // get city list from local storage
  var savedCityList = localStorage.getItem("cityList");

  // if there is a saved city list, update the city list array to it
  if (savedCityList) {
    cityList = JSON.parse(savedCityList);
  }

  // render city list to page
  renderCityList();
};


// event listeners
citySearchFormEl.addEventListener("submit", formSubmitHandler);
cityListEl.addEventListener("click", cityClickHandler);
// clearHistoryEl.addEventListener("click", clearHistoryHandler);
// window.addEventListener("load", pageLoadHandler);
