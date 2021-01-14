var cityName = "Chicago";
var apiKey = "2e445b75f57f2c3f031b78969d6f739f";
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#cityname");
var infoSectionEl = document.querySelector("#info-section");
var currentDayCardEl = document.querySelector("#current-day-card");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistory = [];
var maxSearchHistory = 8;
var localStorageName = "brianckwang-weather-dashboard-items";
var firstPass = false;

var loadSearchHistory = function() {
  searchHistory = JSON.parse(localStorage.getItem(localStorageName));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!searchHistory) {
    searchHistory = [];
  }
  else{
    searchHistory.forEach(function(item, index){
      // console.log(item);
      $(searchHistoryEl).append('<li class="list-group-item">' + item + '</li>');
    })
  }
};

var saveSearchHistory = function() {
  localStorage.setItem(localStorageName, JSON.stringify(searchHistory));
};

var updateSearchHistory = function() {
  searchHistory.unshift(cityName);
  $(searchHistoryEl).prepend('<li class="list-group-item">' + cityName + '</li>');
  if(searchHistory.length > maxSearchHistory){
    searchHistory.pop();
    $(searchHistoryEl).children().last().remove();
  }
  saveSearchHistory();
}

var  getCurrentDay_Main = function(cityName, apiKey) {
  // make a request to the url

  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=metric&appid=" + apiKey)
  .then(function(response){
    if(response.ok){
      return response.json();
    }
    else{
      console.log('Unable to connect to OpenWeather - Current day api');
    }
  })
  .then(function(data) {
    return fetch("http://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey);
  })
  .then(function(response) {
    if(response.ok){
      return response.json();
    }
    else{
      console.log('Unable to connect to OpenWeather - One call api');
    }
  })
  .then(function(data) {
    displayWeatherInfo(data);
    if(firstPass){
      updateSearchHistory();
    }
    firstPass = true;
    
    $(infoSectionEl).css("visibility", "visible");
    
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    console.log('Unable to connect to OpenWeather', error);
  });

};

var displayDates = function() {
  $(currentDayCardEl).find(".date span").text(cityName + " (" + moment().format('ddd, YYYY/MM/DD') + ")");
  for(var i = 1; i <= 5; i++){
    var forecastDayEl = document.querySelector("#day-" + i);
    $(forecastDayEl).find(".date").text(moment().add(i, 'days').format('ddd, MM/DD'));
  }
}

var displayWeatherInfo = function(data) {
  // moment().unix(data.current.dt).format('ddd, YYYY/MM/DD')
  // console.log(data);
  $(currentDayCardEl).find(".date span").text(cityName.charAt(0).toUpperCase() + cityName.slice(1) + " (" + moment().format('ddd, YYYY/MM/DD') + ")");
  $(currentDayCardEl).find(".date img").attr("src", "./assets/icons/" + data.current.weather[0].icon + ".png");
  $(currentDayCardEl).find(".temp span").text(data.current.temp);
  $(currentDayCardEl).find(".humidity span").text(data.current.humidity );
  $(currentDayCardEl).find(".wind span").text(data.current.wind_speed);
  
  $(currentDayCardEl).find(".uv span").text(data.current.uvi);
  $(currentDayCardEl).find(".uv span").removeClass("badge-success badge-warning badge-danger");

  if(data.current.uvi < 2){
    $(currentDayCardEl).find(".uv span").addClass("badge-success");
  }
  else if(data.current.uvi < 5){
    $(currentDayCardEl).find(".uv span").addClass("badge-warning");
  }
  else{
    $(currentDayCardEl).find(".uv span").addClass("badge-danger");
  }

  for(var i = 1; i <= 5; i++){
    var forecastDayEl = document.querySelector("#day-" + i);
    // src="./assets/icons/01d.png"

    // console.log("./assets/icons/" + data.daily[i].weather.icon + ".png");
    // console.log(data.daily[i].weather[0].icon);

    $(forecastDayEl).find(".icon img").attr("src", "./assets/icons/" + data.daily[i].weather[0].icon + ".png");
    $(forecastDayEl).find(".temp span").text(data.daily[i].temp.day);
    $(forecastDayEl).find(".humidity span").text(data.daily[i].humidity);
  }
}



var formSubmitHandler = function(event) {
  event.preventDefault();
  // get value from input element
  if(cityName != nameInputEl.value.trim()){
    cityName = nameInputEl.value.trim();

    if (cityName) {
      getCurrentDay_Main(cityName, apiKey);
      nameInputEl.value = "";
    } else {
      alert("Please enter a city name");
    }
  }
  nameInputEl.value = "";
};

displayDates();
loadSearchHistory();
if(searchHistory.length > 0){
  cityName = searchHistory[0];
  getCurrentDay_Main(searchHistory[0], apiKey);
}


// $(infoSectionEl).css("visibility", "visible");
// getCurrentDay_Main(cityName, apiKey);

userFormEl.addEventListener("submit", formSubmitHandler);
