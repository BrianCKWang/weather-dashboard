var mainData;

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
  console.log(data.name);
  console.log(data.main.temp);
  console.log(data.main.humidity);
  console.log(data.wind.speed);
  console.log(data.main.temp);
  console.log(data.coord.lat);
  console.log(data.coord.lon);

  mainData = data;
}

var displayDay_UV = function(data) {
  console.log(data);
  console.log(data.lat);
  console.log(data.lon);
  console.log(data.value);
  mainData.UVIndex = data.value;
  console.log(mainData);
}

var cityName = "chicago";
var apiKey = "2e445b75f57f2c3f031b78969d6f739f";
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey;

getCurrentDay_Main(apiUrl);
