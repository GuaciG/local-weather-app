//when window is loaded, it calls getGeo()
window.addEventListener("load", getGeo); 

//----This function checks if browser supports geolocation or if it is disabled.
function getGeo() {
  //if not geolocation, it throws an error message.  
  if (!navigator.geolocation) {
    showError();
  }  
  //if geolocation is available, calls showPosition() to get lat and lon (parameters to apply in getWeather()). 
  navigator.geolocation.getCurrentPosition(showPosition, showError);
    
  function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    getWeather(latitude, longitude);
  
  } 
  //function showError shows error message and hide container.    
  function showError(e) {
    console.log(e);
    var message = document.getElementById("error");
    var container = document.getElementById("container");
    message.style.display = "block";
    container.style.display = "none"; 
  }
       
};

//----Print date format: ej. "Monday 25 July 2019"
var currDate = new Date();
var date = document.getElementById("date");
date.innerText = printDate(currDate);

function printDate(d) {
  var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  //Get specific information that you need from new Date(). 
  //Only day. 
  var day = document.getElementById("day");
  day.innerText = days[d.getDay()];
  //day of the month, month and year. 
  var monthDay = d.getDate();
  var month = months[d.getMonth()];
  var year = d.getFullYear();

  //Here monthDay + month + year (20 junio 2020).
  return `${monthDay} ${month} ${year}`;
}


//Toggle "buttons" to change temperature and thermal sensation to Celsius or Fahrenheit, and wind speed to Kmph or Mph
var celsius = document.getElementById("C");
var fahrenheit = document.getElementById("F");
var kmph = document.getElementById("kmph");
var mph = document.getElementById("mph");
  
//Listeners event onclick in each "button": 
//celsius "C"
celsius.onclick = function() {
  celsius.className = "";
  fahrenheit.className = "unselect";
  printTemp("celsius");
  printSensation("celsius");
}
//fahrenheit "F"  
fahrenheit.onclick = function() {
  fahrenheit.className = "";
  celsius.className = "unselect";
  printTemp("fahrenheit");
  printSensation("fahrenheit");
}
//Kilometers per hour "kmph" 
kmph.onclick = function() {
  kmph.className = "";
  mph.className = "unselect";
  printWind("kmph");
}
//Miles per hour "mph"  
mph.onclick = function() {
  mph.className = "";
  kmph.className = "unselect";
  printWind("mph");
}


//Object for weather. We need an object to store the requested data from API
var weatherObj; 

//----getWeather() function uses the got parameters with showPosition() function to request data from OpenWeatherMap API for weather object .
function getWeather(lat, lon) {
  //Make a request to the XMLHttpRequest object
  var weather = new XMLHttpRequest();
  //Here requestURL is web server's url where we request data. 
  var requestURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=" + "ea2effbdebc8975b8ae2baeb57d63317";
  //In the onreadystatechange property of the XMLHttpRequest obj we define the function to be executed when the request receives an answer. 
  weather.onreadystatechange = function() {
    //readyState 	holds the status of the XMLHttpRequest and 4 means: request finished and response is ready
    //status 	200: "OK"
    if (this.readyState === 4 && this.status === 200) {
      //we received data as a string. Parse the data with JSON.parse() and data becomes an object. Then pass it to the printWeather() function as a parameter. 
      weatherObj = (JSON.parse(this.responseText));
      printWeather(weatherObj);
    }
  }
  //send a request to a server, we use the open() and send() methods of the XMLHttpRequest object. 
  weather.open("GET", requestURL);
  weather.send();
};
  
//---- Print weather information to the screen.
function printWeather(obj) {
  //we can see the information on the console. 
  console.log(obj);
  
  //Print Location
  var location = document.querySelector("#location h2");
  location.textContent = obj.name + ", " + obj.sys.country;
  
  //Print Icon
  var descriptionIcon = document.getElementById("descriptionIcon");
  descriptionIcon.setAttribute("src", "http://openweathermap.org/img/w/" + obj.weather[0].icon + ".png");
  
  
  //Print Description
  var description = document.querySelector("#description h3");
  description.textContent = obj.weather[0].description;
  
  //Print Temperature, also called by °C and °F buttons. 
  printTemp("celsius"); 
  //Update the background depending on temperature.
  setBackground(); 
  //Function also called by °C and °F buttons.
  printSensation("celsius"); 
  //Print Windspeed, also called by Kmph and mph buttons.
  printWind("kmph"); 
  //Print Humidity. 
  printHumidity("percentage"); 
  //Print Humidity.
  printPressure("pascals");

}
  
//---- Prints temperature to screen.
function printTemp(temp) {
  //Get element for temperature. 
  var temperature = document.querySelector("#temperature h2");
  
  //Set temperature depending on degrees setting.
  if (temp === "celsius") {
    temperature.textContent = (weatherObj.main.temp - 273.15).toFixed(1) + "°C";
  }   
  else {
    temperature.textContent = (9 / 5 * (weatherObj.main.temp - 273.15) + 32).toFixed(1) + "°F";
  }

}

//---- Prints thermal sensation to screen. 
function printSensation(degrees) {
  //Get element for thermal sensation. 
  var thermalSensation = document.querySelector("#feelLike h4");

  //Set thermal sensation depending on degrees setting. 
  if(degrees === "celsius") {
    thermalSensation.textContent = (weatherObj.main.feels_like - 273.15).toFixed(1) + "°C";
  }
  else {
    thermalSensation.textContent = (9 / 5 * (weatherObj.main.feels_like - 273.15) + 32).toFixed(1) + "°F";
  }

}
  
//---- Prints wind speed to screen.
function printWind(speed) {
  //Get element for thermal sensation.
  var windSpeed = document.querySelector("#windSpeed h2");
  
  //Set wind depending on mph or kmph setting.
  if (speed === "kmph") {
    windSpeed.textContent = (weatherObj.wind.speed * 1.852).toFixed(1) + " Kmph";
  }   
  else {
    windSpeed.textContent = (weatherObj.wind.speed * 1.15).toFixed(1) + " Mph";
  }

}

//---- Prints humidity to screen.
function printHumidity() {
  //Get element for humidity.
  var humidity = document.querySelector("#humidity h2");
  //Set humidity in percentage. 
  humidity.textContent = (weatherObj.main.humidity) + " %";
}

//---- Prints pressure to screen.
function printPressure() {
  //Get element for pressure.
  var pressure = document.querySelector("#pressure h2");
  //Set pressure in Pascals. 
  pressure.textContent = (weatherObj.main.pressure) + "Pa";
}




//---- Changes the background depending on the id weather.
function setBackground() {

  var idWeather = weatherObj.weather[0].id;
  var image = "";
  
  //clear
  if (idWeather === 800) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603493/Proyectos/Weather/clear-800_hqyouu.jpg')";
  //clouds
  else if (idWeather === 801) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603493/Proyectos/Weather/few_clouds-801_z6dgib.jpg')";
  else if (idWeather === 802) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603493/Proyectos/Weather/scattered_clouds-802_qdm2pk.jpg')";
  else if (idWeather === 803) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603493/Proyectos/Weather/broken_clouds-803_yxu0a4.jpg')";
  else if (idWeather === 804) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603493/Proyectos/Weather/overcast_clouds-804_bo0irt.jpg')";
  //Atmosphere
  else if (idWeather === 701 || idWeather === 711 || idWeather === 721 || idWeather === 741) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603712/Proyectos/Weather/mist_smoke_haze_fog-701-711-721-741_axhawn.jpg')";
  else if (idWeather === 771) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603712/Proyectos/Weather/Squall-771_tpzwht.jpg')";
  else if (idWeather === 731 || idWeather === 751 || idWeather === 761 || idWeather === 762) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603712/Proyectos/Weather/dust_sand_ash-731-751-761-762_ksxseg.jpg')";
  else if (idWeather === 781) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603712/Proyectos/Weather/tornado-781_wdkgft.jpg')";
  //light snow
  else if (idWeather === 600 || idWeather === 611 || idWeather === 612 || idWeather === 613 || idWeather === 615 || idWeather === 616 || idWeather === 620 || idWeather === 621 || idWeather === 622) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603885/Proyectos/Weather/light_snow-sleet-600-611-612-613-615-616-620-621-622_mrfjxe.jpg')";
  //snow
  else if (idWeather === 601) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603885/Proyectos/Weather/snow-601_jms96x.jpg')";
  //heavy snow
  else if (idWeather === 602) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603885/Proyectos/Weather/heavy_snow-602_ungn61.jpg')";
  //light rain
  else if (idWeather === 500) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603966/Proyectos/Weather/light_rain-500_b5pxui.jpg')";
  //moderate rain and ragged showed rain
  else if (idWeather === 501 || idWeather === 531) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603966/Proyectos/Weather/moderate_rain-ragged_shower_rain-501-531_pkqgyw.jpg')";
  //intensity rain
  else if (idWeather === 502 || idWeather === 503 || idWeather === 504) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603965/Proyectos/Weather/extreme_rain-502-503-504_kblgfg.jpg')";
   //shower rain
   else if (idWeather === 520 || idWeather === 521 || idWeather === 522) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603966/Proyectos/Weather/shower_rain-520-521-522_ah7esm.jpg')";
  //freezing rain and drizzle
  else if (idWeather === 511 || idWeather === 300 || idWeather === 301 || idWeather === 302 || idWeather === 310 || idWeather === 311 || idWeather === 312 || idWeather === 313 || idWeather === 314 || idWeather === 321) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607603965/Proyectos/Weather/freezing_rain-511_xti4bm.jpg')";
  //thunderstorm
  else if (idWeather === 200 || idWeather === 201 || idWeather === 202 || idWeather === 210 || idWeather === 211 || idWeather === 212 || idWeather === 221 || idWeather === 230 || idWeather === 231 || idWeather === 232) image = "url('https://res.cloudinary.com/drpcjt13x/image/upload/v1607604206/Proyectos/Weather/thunderstorm-200_kqz0zt.jpg')";
  
  document.body.style.backgroundImage = image;
}