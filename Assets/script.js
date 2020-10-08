var coordinates;

function getForecast(cityName) {

    var city = cityName;
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=510c7f3ff27ad1727021b6aa3db8d1b0"

    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {

        var lat = response.city.coord["lat"];
        var lon = response.city.coord["lon"];

        var queryUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely,alert&appid=510c7f3ff27ad1727021b6aa3db8d1b0"

        $.ajax({
            url: queryUrl,
            method: "GET"

        }).then(function (response) {

            console.log(response);

        })
    })

}

getForecast("london");






