var mainData;
var currentDayCardEl = document.querySelector("#current-day-card");
var forecastDay1El = document.querySelector("#day-1");
var forecastDay2El = document.querySelector("#day-2");
var forecastDay3El = document.querySelector("#day-3");
var forecastDay4El = document.querySelector("#day-4");
var forecastDay5El = document.querySelector("#day-5");

var getCurrentDay_Main = function(apiUrl) {
  // make a request to the url
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayDay_main(data);
        getCurrentDay_UV("http://api.openweathermap.org/data/2.5/uvi?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + apiKey);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to OpenWeather");
    
  });
};

var getCurrentDay_UV = function(apiUrl) {
  // make a request to the url
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        displayDay_UV(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  })
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to OpenWeather");
    
  });
};

var displayDay_main = function(data) {
  console.log(data);
  // console.log(data.name);
  // console.log(data.main.temp);
  // console.log(data.main.humidity);
  // console.log(data.wind.speed);
  // console.log(data.main.temp);
  // console.log(data.coord.lat);
  // console.log(data.coord.lon);

  mainData = data;

  // currentDayCardEl.querySelector(".temp").textContent = "Temp: " + mainData.main.temp + "F";
  // currentDayCardEl.querySelector(".humidity").textContent = "Humidity: " + mainData.main.humidity + "%";
  // currentDayCardEl.querySelector(".wind").textContent = "Temp: " + mainData.wind.speed + "meter/sec";
  $(currentDayCardEl).find(".date span").text(data.name + " (" + moment().format('ddd, YYYY/MM/DD') + ")");
  $(currentDayCardEl).find(".temp span").text(mainData.main.temp);
  $(currentDayCardEl).find(".humidity span").text(mainData.main.humidity );
  $(currentDayCardEl).find(".wind span").text(mainData.wind.speed);
  
}

var displayDay_UV = function(data) {
  console.log(data);
  // console.log(data.lat);
  // console.log(data.lon);
  // console.log(data.value);
  mainData.UVIndex = data.value;
  // console.log(mainData);
  $(currentDayCardEl).find(".uv span").text(mainData.UVIndex);
  $(currentDayCardEl).find(".uv span").removeClass("badge-success badge-warning badge-danger");
  if(mainData.UVIndex < 2){
    $(currentDayCardEl).find(".uv span").addClass("badge-success");
  }
  else if(mainData.UVIndex < 5){
    $(currentDayCardEl).find(".uv span").addClass("badge-warning");
  }
  else{
    $(currentDayCardEl).find(".uv span").addClass("badge-danger");
  }
}

var cityName = "chicago";
var apiKey = "2e445b75f57f2c3f031b78969d6f739f";
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

getCurrentDay_Main(apiUrl);
