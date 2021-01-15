// var cityName = "Chicago";
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#cityname");
var infoSectionEl = document.querySelector("#info-section");
var currentDayCardEl = document.querySelector("#current-day-card");
var searchHistoryEl = document.querySelector("#search-history");
var searchHistory = [];
var maxSearchHistory = 8;
var localStorageName = "brianckwang-weather-dashboard-items";
var firstPass = false;

// local storage handling
var loadSearchHistory = function() {
  searchHistory = JSON.parse(localStorage.getItem(localStorageName));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!searchHistory) {
    searchHistory = [];
  }
  else{
    searchHistory.forEach(function(item, index){
      // console.log(item);
      // 
      $(searchHistoryEl).append('<li class="list-group-item"><a href="#user-form">' + item + '</a></li>');
    })
  }
};

var saveSearchHistory = function() {
  localStorage.setItem(localStorageName, JSON.stringify(searchHistory));
};

var updateSearchHistory = function(cityName) {
  searchHistory.unshift(cityName);
  $(searchHistoryEl).prepend('<li class="list-group-item"><a href="#user-form">' + cityName + '</a></li>');
  if(searchHistory.length > maxSearchHistory){
    searchHistory.pop();
    $(searchHistoryEl).children().last().remove();
  }
  saveSearchHistory();
}

var  getWeatherData = function(cityName, apiKey) {
  // use current day to get coord for one call api
  console.log(cityName);
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
    // one call api for all weather information
    return fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&exclude=minutely,hourly,alerts&units=metric&appid=" + apiKey);
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
    // api call successful, display all information and update search history
    displayWeatherInfo(cityName, data);
    if(firstPass){
      updateSearchHistory(cityName);
    }
    firstPass = true;
    
    $(infoSectionEl).css("visibility", "visible");
    
  })
  .catch(function(error) {
    console.log('Unable to connect to OpenWeather', error);
  });

};

// utility functions
// this function takes a string and return words all capitalized
var capitalizeAll = function(str) {
  var splitStr = str.toLowerCase().split(' ');

  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
  }

  return splitStr.join(' '); 
}

// display functions
var displayDates = function(cityName) {
  $(currentDayCardEl).find(".date span").text(cityName + " (" + moment().format('ddd, YYYY/MM/DD') + ")");
  for(var i = 1; i <= 5; i++){
    var forecastDayEl = document.querySelector("#day-" + i);
    $(forecastDayEl).find(".date").text(moment().add(i, 'days').format('ddd, MM/DD'));
  }
}

var displayWeatherInfo = function(cityName, data) {
  // update current day card information
  displayDates(cityName);

  $(currentDayCardEl).find(".date span").text(capitalizeAll(cityName) + " (" + moment().format('ddd, YYYY/MM/DD') + ")");
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

  // update forecast cards information
  for(var i = 1; i <= 5; i++){
    var forecastDayEl = document.querySelector("#day-" + i);

    $(forecastDayEl).find(".icon img").attr("src", "./assets/icons/" + data.daily[i].weather[0].icon + ".png");
    $(forecastDayEl).find(".temp span").text(data.daily[i].temp.day);
    $(forecastDayEl).find(".humidity span").text(data.daily[i].humidity);
  }
}

// event handlers
var apiKey = "2e445b75f57f2c3f031b78969d6f739f";
var searchHistoryItemClickHandler = function(event) {
  getWeatherData(event.toElement.textContent, apiKey);
}

var formSubmitHandler = function(event) {
  event.preventDefault();
  // get value from input element
  cityName = nameInputEl.value.trim();

  if (cityName) {
    getWeatherData(cityName, apiKey);
  } else {
    alert("Please enter a city name");
  }

  nameInputEl.value = "";
};

// main
loadSearchHistory();
if(searchHistory.length > 0){
  cityName = searchHistory[0];
  getWeatherData(searchHistory[0], apiKey);
}
else{
  firstPass = true;
}

// listener events
userFormEl.addEventListener("submit", formSubmitHandler);
searchHistoryEl.addEventListener("click", searchHistoryItemClickHandler);
