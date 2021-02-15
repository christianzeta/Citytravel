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

// Huvudfunktion för att visa sidan beroende på vilken sökning som gjordes
function executeSearch() {
    let option = 'initial';
    for(let i = 0; i < options.length; i++){
        if(options[i].checked){
            option = options[i].value;
        }
    }
    let searchValues = {
        city: searchBar.value,
        filter: option
    }

    switch(searchValues.filter){
        case 'initial':
            displaySite('both');
            getWeatherInfo(searchValues.city);
            getAttractionsInfo(searchValues.city);
            break;
        case 'weather':
            displaySite('weather');
            getWeatherInfo(searchValues.city);
            break;
        case 'attractions':
            displaySite('attractions');
            getAttractionsInfo(searchValues.city);
            break;
        case 'filter':
            displaySite('both');
            getWeatherInfo(searchValues.city);
            getAttractionsInfo(searchValues.city, 'alpha');
            break;
        default:
            break;
    }

}

// Funktion för att ändra titeln i 'main' beroende på vilken stad som söktes efter samt felmeddelanden
function changeCityTitle(city){
    let title = city.charAt(0).toUpperCase() + city.slice(1);
    cityTitle.innerText = title;
}

// Denna funktionen används för att kommunicera med openweather servern
// Först skapas en url med staden som söks efter samt inställningar för appid, units och språk
// Sedan använder jag xmlhttprequest genom att skapa en nytt objekt, säger att den skall använda url:en och GET metoden för att hämta information
// Responsen skall vara i form av JSON, genom att sätta responseType ingår även JSON.parse() så att ett objekt returneras
// Efter det har skickats ställer jag in vad som händer om ett resultat har hämtats eller om servern ligger nere
// Vid fellaktigt resultat (ogiltlig sökning) kommer ett felmeddelande visas, annars så uppdates hämsidan med den hämtade informationen
// Är servern nere skickas ett felmeddelande
function getWeatherInfo(city){
    let url = getWeatherUrl(city);
    
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.onload = () => {
        if(xhr.status === 404){
            displayError('Nothing was found for this city')
        }
        else{
            errorSection.style.display = 'none';
            cityTitle.style.display = 'block';
            changeCityTitle(city);
            displayWeather(xhr.response);
        }
    }
    xhr.onerror = (e) => {
        displayError('Could not be loaded..');
        console.log(e);
    }
    xhr.send();
  
}

// Skapar en url med för openweather
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

// Visar upp väderinformation på sidan om ett resultat har hämtats
function displayWeather(info){
    weatherDay.innerText = getDate('day');
    temp.innerText = info.main.temp;
    condition.innerText = info.weather[0].description;
    weatherSection.style.display = 'block';
}

// Här kommunicerar koden med Foursquare servern med samma principer som i funktionen för operweather
// URL:en användes sig dock av fler sökfilter som datum och begränsat antal
function getAttractionsInfo(city, filter){
    let url = getAttractionsUrl(city);
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = () => {
        if(xhr.status === 400){
            displayError('Nothing was found for this city');
        }
        else{
            errorSection.style.display = 'none';
            let info = xhr.response;
            let attractionsArray = info.response.groups[0].items;
            displayAttractions(attractionsArray, filter);
        }
    }
    xhr.onerror = (e) => {
        displayError('Could not be loaded..');
        console.log(e);
    }
    xhr.send();
}

// Visar upp attraktioner på sidan om ett resultat har hämtats
function displayAttractions(attractionsArray, filter){
    attractionSection.innerHTML = '';
    sortArray(attractionsArray, filter);
    for(let i = 0; i < attractionsArray.length; i++){
      
        let icon = attractionsArray[i].venue.categories[0].icon.prefix +'64' + '.png';
        let name = attractionsArray[i].venue.name;
        let address = attractionsArray[i].venue.location.formattedAddress
        let article = createArticle(name, address, icon);
        attractionSection.appendChild(article);
        attractionSection.style.display = 'grid';
    }
}

// Skapar den html som behövs för en attraktion och returnerar den till displayAttractions()
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

// Skapar en URL till foursquare
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

// Visar upp ett felmeddelande om felaktigt eller inget resultat hämtats
function displayError(msg){
        weatherSection.style.display = 'none';
        attractionSection.style.display = 'none';
        errorMsg.innerText = msg;
        errorSection.style.display = 'block';
        cityTitle.style.display = 'none';
}

// Visar upp sidan beroende på vad som valdes i sökningen (bara väder/ bara attraktioner / alfabetiskt)
function displaySite(filter){
    if(filter === 'weather'){
        attractionSection.style.display = 'none';
    } else if(filter === 'attractions'){
        weatherSection.style.display = 'none';
    } else if(filter === 'both'){
        const main = document.querySelector('#main');
        main.style.display = 'block';
        const footer = document.querySelector('#main-footer');
        footer.style.display = 'flex';
    }
}

// Sorterar attraktionerna alfabetiskt innan de visas på sidan
function sortArray(arr, filter){
    if(filter === 'alpha'){
        arr.sort((a, b) => {
            let venueA = a.venue.name.toUpperCase(); 
            var venueB = b.venue.name.toUpperCase(); 
            if (venueA < venueB) {
              return -1;
            }
            if (venueA > venueB) {
              return 1;
            }
            return 0;
          });
    } else{
        return arr;
    }
}

// Skickar tillbaka ett tid/datum format som angets när funktionen kallas på 
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

































