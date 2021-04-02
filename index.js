//4e6d60f819aed532466e617dc2301ed4
//1b90f839f0ad84f4fb096fa613576738

var cities = [];

function FormatDate(date){
    var date = new Date();
    console.log(date); //comment out later
    var month = date.getMonth()+1;
    var day = date.getDate();

    var output = date.getFullYear() + '/' 
    + (month<10 ? '0' : '') + month + '/' 
    + (day<10 ? '0' : '') +day;
    return output;
}

init();

function init(){
    var storedCity = JSON.parse(localStorage.getItem('cities'));

    if (storedCity !==null) {
        cities = storedCity
    }
    renderCities();
}

function storeCities(){
    localStorage.setItem('cities', JSON.stringify(cities));
}

function renderCities(){
    var cityList = $('#citiesList');
    cityList.empty();
    //create list for cities
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var li = $('<li>').text(city);
        li.attr('id','list')
        li.attr('data-city', city);
        li.attr('class', 'list-group-item')
        cityList.prepend(li);
    }
    if (!city){
        return
    }
    else{
        getWeather(city);
    }
}

//on form submit
$('#add').on('click', function(event){
    event.preventDefault();
    var city = $('#input').val().trim();
    if (city === "") {
        return;
    }
    cities.push(city);
    storeCities();
    renderCities();
});

function getWeather(cityName){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + '&APPID=' + '1b90f839f0ad84f4fb096fa613576738'

    $('#weather').empty();
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        console.log(response);
        cityTitle = $('<h3>').text(response.name + ' ' + FormatDate());
        $('#weather').append(cityTitle);
        var TempToNum = parseInt((response.main.temp)*9/5-459);
        var cityTemp = $('<p>').text('Temperature: '+ TempToNum + ' °F');
        $('#weather').append(cityTemp);
        var cityHumidity = $("<p>").text('Humidity: '+ response.main.humidity + ' %');
        $("#weather").append(cityHumidity);
        var cityWind = $("<p>").text('Wind Speed: '+ response.wind.speed + ' MPH');
        $("#weather").append(cityWind);
        //latitiude/longitude
        var Long = response.coord.lon;
        var Lat = response.coord.lat;

        var queryURL2 = 'http://api.openweathermap.org/data/2.5/uvi?appid=4e6d60f819aed532466e617dc2301ed4'
        + '&lat=' + Lat +'&lon='+Long;
        $.ajax({
            url: queryURL2,
            method: 'GET'
        }).then(function(responseuv){
            var cityUV = $('<span>').text(responseuv.value);
            var cityUVp = $('<p>').text('UV Index: ');
            cityUVp.append(cityUV);
            $('#weather').append(cityUVp);
            });
        var queryURL3 = 'http://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + '4e6d60f819aed532466e617dc2301ed4' + '&units=imperial';
        $.ajax({
            url: queryURL3,
            method: 'GET'
        }).then(function(response5day){
            $('#boxes').empty();
            for(var i=0, j=0; j<=5; i=i+6){ 
                var readDate = response5day.list[i].dt;
                if(response5day.list[i].dt != response5day.list[i+1].dt){
                    var addDiv = $('<div>');
                    addDiv.attr('class','col-3 bg-primary');
                    var date = new Date(0);
                    date.setUTCSeconds(readDate);
                    var fixeddate = date;
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dayOutput = date.getFullYear() + '/' 
                    + (month<10 ? '0' : '') + month + '/' 
                    + (day<10 ? '0' : '') +day;
                    var addHead = $('<h4>').text(dayOutput);
                    var addImg = $('<img>');
                    var cloud = response5day.list[i].weather[0].main;
                    if(cloud==='Clouds'){
                        addImg.attr('src', 'https://img.icons8.com/color/48/000000/cloud.png')
                    }
                    else if(cloud==='Clear'){
                        addImg.attr('src', 'https://img.icons8.com/color/48/000000/summer.png')
                    }
                    else if(cloud==='Rain'){
                        addImg.attr('src', 'https://img.icons8.com/color/48/000000/rain.png')
                    }

                    var FiveDayTempK = response5day.list[i].main.temp;
                    var TempToNum = parseInt((FiveDayTempK));
                    var addP = $('<p>').text('Temperature: ' + TempToNum + ' °F');
                    var addPHum = $('<p>').text('Humidity: ' + response5day.list[i].main.humidity + ' %');
                    addDiv.append(addHead);
                    addDiv.append(addImg);
                    addDiv.append(addP);
                    addDiv.append(addPHum);
                    $('#boxes').append(addDiv);
                    j++
                }                
            }
        });
    });
}


// $.ajax({}).then(function(response) {
//     console.log(response);

//     // UVI API => pass coordinates from weather API to UVI API
//     $.ajax({}).then(function(response){

//     });

//     // 5 day forcast 
//     $.ajax({}).then(function(response){

//     });
// });