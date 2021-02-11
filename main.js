"use strict";
const searchBtn = document.querySelector('#submit');
const searchBar = document.querySelector('#searchbar')
const options = document.getElementsByName('opt');
const cityTitle = document.querySelector('#city-title');
const temp = document.querySelector('#temp');
const condition = document.querySelector('#condition');
const weatherDay = document.querySelector('#weather-day')

searchBtn.addEventListener('click', executeSearch);

function changeCityTitle(city){
    cityTitle.innerText = city;
}

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

    changeCityTitle(searchValues.city);
    getWeatherInfo(searchValues.city, displayWeather);
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

function getWeatherInfo(city, displayWeather){
    let url = getWeatherUrl(city);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.onload = () => {
        displayWeather(xhr.response);
    }
    xhr.send();
}

function displayWeather(info){
    weatherDay.innerText = getDate('day');
    temp.innerText = info.main.temp;
    condition.innerText = info.weather[0].description;
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

    if(format = 'day'){
        return dayOfWeek;
    } else if(format = '¨YMDay'){
        return YMDay;
    }
}


























/*
let CLIENT_ID = 'BMF55ZEHJXLKTPUKURRRCZLFUDKQDLNOOCBSSMQ3PJLPBYEU';
let CLIENT_SECRET = 'X5YGNPMAFTLHFGYSG5SEN0B4FRRBX0HK5DXGCPOSALX1F4PT';
let today = getDate();
console.log(today);
let foursquareGET = `https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${today}`;

*/