var coordinates;
var cityInfoEl = $(".cityInfo");
var tempEl = $(".temp");
var humidityEl = $(".humidity");
var windSpeedEl = $(".windSpeed");
var uvIndexEl = $(".uvIndex");

function getForecast(cityName) {

    var city = cityName.trim();
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=510c7f3ff27ad1727021b6aa3db8d1b0"

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {

        var lat = response.city.coord["lat"];
        var lon = response.city.coord["lon"];

        var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=hourly,minutely,alert&appid=510c7f3ff27ad1727021b6aa3db8d1b0"

        $.ajax({
            url: queryUrl,
            method: "GET"

        }).then(function (response) {

            console.log(response);
            var date = new Date(response.current);


            cityInfoEl.text(city[0].toUpperCase() + city.slice(1) + "");
            tempEl.text("Temperature: " + response.current.temp + " F");
            humidityEl.text("Humidity: " + response.current.humidity + "%");
            windSpeedEl.text("Wind Speed: " + response.current.wind_speed + "MPH");
            uvIndexEl.text("UV Index: " + response.current.uvi);

        })
    })
}


$(".searchBtn").on("click", function (event) {
    event.preventDefault();
    if ($(".search").val() != null) {
        getForecast($(".search").val());
    }
})







