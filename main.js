"use strict";
let CLIENT_ID = 'BMF55ZEHJXLKTPUKURRRCZLFUDKQDLNOOCBSSMQ3PJLPBYEU';
let CLIENT_SECRET = 'X5YGNPMAFTLHFGYSG5SEN0B4FRRBX0HK5DXGCPOSALX1F4PT';
let today = getDate();
console.log(today);
let foursquareGET = `https://api.foursquare.com/v2/venues/search?ll=40.7,-74&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=${today}`;

function executeSearch(){

}

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
    return today;
}