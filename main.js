"use strict";
const searchBtn = document.querySelector('#submit');
const searchBar = document.querySelector('#searchbar')
const options = document.getElementsByName('opt');

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



























/*
let CLIENT_ID = 'BMF55ZEHJXLKTPUKURRRCZLFUDKQDLNOOCBSSMQ3PJLPBYEU';
let CLIENT_SECRET = 'X5YGNPMAFTLHFGYSG5SEN0B4FRRBX0HK5DXGCPOSALX1F4PT';
let today = getDate();
console.log(today);
let foursquareGET = `https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${today}`;

function getDate(){
    let date = new Date();
    let month = date.getUTCMonth() + 1; 
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();

    if(month < 10){
        month = '0' + month.toString();
    }
    if(day < 10){
        day = '0' + day.toString();
    }

    let today = year.toString() + month.toString() + day.toString();

'¨ä    return today;
}
*/