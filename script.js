var coordinates;
var cityInfoEl = $(".cityInfo");
var tempEl = $(".temp");
var humidityEl = $(".humidity");
var windSpeedEl = $(".windSpeed");
var uvIndexEl = $(".uvIndex");
var searchHistEl = $(".searchHistory");

//function to get the forcast for a given city
function getForecast(cityName) {

    //add search to the history in localstorage
    var searchHistory = JSON.parse(localStorage.getItem("history")) || [];
    var cityNameFormatted = cityName[0].toUpperCase() + cityName.slice(1);
    console.log(cityNameFormatted);

    if (!searchHistory.includes(cityNameFormatted)) {
        searchHistory.push(cityName);
    }

    localStorage.setItem("history", JSON.stringify(searchHistory));


    var city = cityName.trim();
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=510c7f3ff27ad1727021b6aa3db8d1b0"

    //query to openweather api to get coordinates of city
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {

        //obtain coordinates of city from first ajax query
        var lat = response.city.coord["lat"];
        var lon = response.city.coord["lon"];

        var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely,alert&appid=510c7f3ff27ad1727021b6aa3db8d1b0"

        //second ajax query to openweather to obtain weather
        $.ajax({

            url: queryUrl,
            method: "GET"

            //dynamically build html for given city
        }).then(function (response) {

            var date = new Date(response.current.dt * 1000);

            //populate current weather box
            cityInfoEl.text(city[0].toUpperCase() + city.slice(1) + " " + (parseInt(date.getMonth()) + 1) + "/" + date.getDate() + "/" + date.getFullYear());
            tempEl.text("Temperature: " + response.current.temp + " F");
            humidityEl.text("Humidity: " + response.current.humidity + "%");
            windSpeedEl.text("Wind Speed: " + response.current.wind_speed + "MPH");
            uvIndexEl.text("UV Index: " + response.current.uvi);

            if (response.current.uvi < 3) {
                uvIndexEl.addClass("btn btn-success")
            } else if (response.current.uvi >= 3 && response.current.uvi < 5) {
                uvIndexEl.addClass("btn btn-warning")
            } else {
                uvIndexEl.addClass("btn btn-danger")
            }

            //populate future weather boxes
            var days = response.daily.slice(1);
            days.pop();
            days.pop();
            days.forEach(day => {

                var dailyWeather = $("<div>");
                dailyWeather.addClass("border rounded bg-primary m-3");

                var tempDate = new Date(day.dt * 1000);
                var dailyDate = $("<p>" + (parseInt(tempDate.getMonth()) + 1) + "/" + tempDate.getDate() + "/" + tempDate.getFullYear() + "<p>");
                dailyDate.attr("style", "font-weight: bold; ")
                dailyDate.addClass("col-12");

                var dailyTemp = $("<p>Temp: " + day.temp.day + " F</p>");
                var dailyHumidity = $("<p>Humidity: " + day.humidity + "%</p>");

                dailyWeather.append(dailyDate);
                dailyWeather.append(dailyTemp);
                dailyWeather.append(dailyHumidity);

                $(".5DayForecast").append(dailyWeather);

            })

        })
    })
}


//get forcast of first history item by default
if (localStorage.getItem("history") != null) {
    getForecast(JSON.parse(localStorage.getItem("history"))[0]);
}



//function to create history elements
function renderHistory() {
    var history = JSON.parse(localStorage.getItem("history")) || [];

    console.log(history);
    history.forEach(city => {
        var btnEl = $("<button>");
        btnEl.text(city);
        btnEl.addClass("btn btn-secondary m-1 histBtn");
        btnEl.attr("type", "button");

        searchHistEl.append(btnEl);
        searchHistEl.append($("<br>"));
    })
}

//invoking renderHistory function once when page opens
renderHistory();

//event listner for search button
$(".searchBtn").on("click", function (event) {
    event.preventDefault();

    searchHistEl.empty();

    if ($(".search").val() != null) {
        $(".5DayForecast").empty();
        getForecast($(".search").val());
    }
    renderHistory();
})

//event listener for history buttons
$(".histBtn").on("click", function (event) {
    $(".5DayForecast").empty();
    getForecast(event.target.textContent);
})








