"use strict";
const searchBtn = document.querySelector('#submit');
const searchBar = document.querySelector('#searchbar')
const options = document.getElementsByName('opt');
const cityTitle = document.querySelector('#city-title');
const temp = document.querySelector('#temp');
const condition = document.querySelector('#condition');
const weatherDay = document.querySelector('#weather-day')
const errorSection = document.querySelector('#error-section');
const weatherSection = document.querySelector('#weather-section');
const errorMsg = document.querySelector('#error-msg');
const attractionName = document.querySelector('#attraction-name');
const attractionAdress = document.querySelector('#attraction-adress');
const attractionSection = document.querySelector('#attraction-section');

searchBtn.addEventListener('click', executeSearch);

function executeSearch() {
    let option = 'false';
    for(let i = 0; i < options.length; i++){
        if(options[i].checked){
            console.log(options[i].value)
            option = options[i].value;
        }
    }
    let searchValues = {
        city: searchBar.value,
        filter: option
    }

    getWeatherInfo(searchValues.city);
    getAttractionsInfo(searchValues.city);
}

function changeCityTitle(city){
    let title = city.charAt(0).toUpperCase() + city.slice(1);
    cityTitle.innerText = title;
}

function getWeatherInfo(city){
    let url = getWeatherUrl(city);
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.onload = () => {
        if(xhr.status === 404){
            displayError('weather', 'Weather was not found, try again..')
        }
        else{
            errorSection.style.display = 'none';
            changeCityTitle(city);
            displayWeather(xhr.response);
        }
    }
    xhr.onerror = () => {
        displayError('Sorry, cant show weather updates right now..');
    }
    xhr.send();
  
}

function getWeatherUrl(city){
    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    const searchParams = {
        q: city,
        appid: '8a8cc7486f4d3b161979f954e21e692b',
        units: 'metric',
        lang: 'sv'
    }
    for(let prop in searchParams){
        url.searchParams.append(prop, searchParams[prop]);
    }
    return url;
}

function displayWeather(info){
    weatherDay.innerText = getDate('day');
    temp.innerText = info.main.temp;
    condition.innerText = info.weather[0].description;
    weatherSection.style.display = 'block';
}

function getAttractionsInfo(city){
    let url = getAttractionsUrl(city);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
        let info = xhr.response;
        let attractionsArray = info.response.groups[0].items;
        displayAttractions(attractionsArray);
    }
    xhr.send();
}

function displayAttractions(attractionsArray){
    
    for(let i = 0; i < attractionsArray.length; i++){
      
        let icon = attractionsArray[i].venue.categories[0].icon.prefix +'64' + '.png';
        let name = attractionsArray[i].venue.name;
        let address = attractionsArray[i].venue.location.formattedAddress
        let article = createArticle(name, address, icon);
        attractionSection.appendChild(article);
    }
}

function createArticle(name, Iaddress, icon){
    let article = document.createElement('article');
    article.classList.add('attraction-article');
    let title = document.createElement('h2');
    title.classList.add('attraction-title');
    title.innerText = name;
    article.appendChild(title);
    let div = document.createElement('div');
    let address = document.createElement('address');
    address.classList.add('attraction-address');
    address.innerText = Iaddress.toString();
    let image = document.createElement('img');
    image.classList.add('attraction-image');
    image.src = icon;
    div.appendChild(image);
    div.appendChild(address);
    article.appendChild(div);

    return article;
}

function getAttractionsUrl(city){
    const url = new URL('https://api.foursquare.com/v2/venues/explore');
    const searchParams = {
        client_id: 'BMF55ZEHJXLKTPUKURRRCZLFUDKQDLNOOCBSSMQ3PJLPBYEU',
        client_secret: 'X5YGNPMAFTLHFGYSG5SEN0B4FRRBX0HK5DXGCPOSALX1F4PT',
        limit: 9,
        near: city,
        v: getDate('YMDay')
    }
    for(let prop in searchParams){
        url.searchParams.append(prop, searchParams[prop]);
    }
    return url;
}

function displayError(errorType, msg){
    if(errorType === 'weather'){
        weatherSection.style.display = 'none';
        errorMsg.innerText = msg;
        errorSection.style.display = 'block';
    }
}

function getDate(format){
    let date = new Date();
    const weekDay = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
    }

    let dayOfWeek = weekDay[date.getDay()];
 
    let month = date.getMonth() + 1; 
    let day = date.getDate();
    let year = date.getFullYear();

    if(month < 10){
        month = '0' + month.toString();
    }
    if(day < 10){
        day = '0' + day.toString();
    }

    let YMDay = year.toString() + month + day;

    if(format === 'day'){
        return dayOfWeek;
    } else if(format === 'YMDay'){
        return YMDay;
    }
}































