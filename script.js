//API country
let select = document.querySelector(".country-choice");
let apiKeyCountry = "HE7vqF6XdMkgYtW2lGH6GkjXlidrgFkXkgzDAgK9";
let urlApi = "https://countryapi.io/api/all?apikey="+apiKeyCountry;
fetch(urlApi)
.then(response => response.json())
.then(countries => {
    let allCountries = Object.entries(countries);
    allCountries.forEach(element => {
        let option = document.createElement("option");
        option.setAttribute("value", element[1].alpha2Code);
        option.innerText = element[1].name;
        select.appendChild(option);
    })
}).catch(error => {
    console.log("There was an error with the second url api!", error);
});

//API Cities picture
const getCityPicture = async (city) => {
    const apiPicture = "8HxtTGvvPiP5kMMUCkyhH7hcfrKUcZ5nWwardKBFY9s";
    const urlApiPicture = `https://api.unsplash.com/search/photos?query=${city}&client_id=${apiPicture}&per_page=1`;
    const response = await fetch(urlApiPicture);
    return response.json();
}

let form = document.querySelector("form");
form.addEventListener("submit", async (event) =>  {
    let inputValue = document.querySelector("input").value;
    event.preventDefault();
    //Remove all previous data on the page
    document.querySelector(".info-day").innerHTML = "";
    document.querySelector(".info-temperature").innerHTML = "";
    document.querySelector(".info-description").innerHTML = "";
    document.querySelector(".img-of-today").innerHTML = "";
    document.querySelector(".next-day-container").innerHTML = "";

    let countryCode = select.value;
    let apiKey = "1a2bdc980152b863a4df6d2b26be8514";
    const url = "https://api.openweathermap.org/data/2.5/forecast?q="+inputValue+","+countryCode+"&cnt=6&appid="+apiKey+"&units=metric";
    //Picture for the background card of today
    const picture = await getCityPicture(inputValue);
    console.log(picture.results[0].urls.regular);
    let todayCard = document.querySelector(".today-card");
    todayCard.style.backgroundImage = `url(${picture.results[0].urls.regular})`;
    todayCard.style.backgroundSize = "cover";
    todayCard.style.backgroundRepeat = "no-repeat";
    //Show today card after the form is submitted
    let allInfo = document.querySelector(".all-info");
    allInfo.style.display = "block";
    todayCard.style.display = "block";

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const weekdayList = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];
        let i = 1;
        data.list.forEach(el=> {
            //To find the date of yesterday this way the date will be correct and not a day ahead because of the +i
            let currentDate = new Date();
            let timestampYesterday = currentDate.getTime() - (24 * 60 * 60 * 1000);
            let yesterdayDate = new Date(timestampYesterday);

            const findDay = nbDay => {
                if(nbDay + yesterdayDate.getDay() > 6) {
                    return nbDay + yesterdayDate.getDay()-7
                } else {
                    return nbDay + yesterdayDate.getDay();
                }
            };

           //The Info Of Current Day
            let infoDay = document.querySelector(".info-day");
            let pToday = document.createElement("p");
            infoDay.appendChild(pToday);
            pToday.innerText = weekdayList[findDay(i)]+", "+Number(yesterdayDate.getDate()+i);
            infoDay.replaceChildren(infoDay.firstElementChild);

            let infoTemperature = document.querySelector(".info-temperature");
            let pTemp = document.createElement("p");
            infoTemperature.appendChild(pTemp);
            pTemp.innerText = el.main.temp+"°";
            infoTemperature.replaceChildren(infoTemperature.firstChild);

            let infoDescription = document.querySelector(".info-description");
            let pDesc = document.createElement("p");
            infoDescription.appendChild(pDesc);
            pDesc.innerHTML =  el.weather[0].description;
            infoDescription.replaceChildren(infoDescription.firstChild);

            //Image of the day
            let imgDiv = document.querySelector(".img-of-today");
            let imgOfToday = document.createElement("img");
            imgOfToday.setAttribute("src", "");
            imgOfToday.classList.add("img-today")
            imgDiv.appendChild(imgOfToday);
            imgDiv.replaceChildren(imgDiv.firstChild);
            //The Info from Other Days
            
            let nextDayContainer = document.querySelector(".next-day-container");
            let nextDayDiv = document.createElement("div");
            nextDayContainer.appendChild(nextDayDiv);
            nextDayDiv.classList.add("next-day-card");
            //img
            let imgNext = document.createElement("img");
            imgNext.setAttribute("src", "");
            imgNext.classList.add("img-next-weather");
            nextDayDiv.appendChild(imgNext);
            if (el.weather[0].main == "Clouds") {
                imgNext.src = "images/cloud.png";
                imgOfToday.src = "images/cloud.png";
            } else if (el.weather[0].main == "Clear") {
                imgNext.src = "images/clear.png";
                imgOfToday.src = "images/clear.png";
            } else if (el.weather[0].main == "Rain") { 
                imgNext.src = "images/rain.png";
                imgOfToday.src = "images/rain.png";
            } else if (el.weather[0].main == "Snow") { 
                imgNext.src = "images/snow-1.png";
                imgOfToday.src = "images/snow.png";
            }
            //Div next-info
            let nextInfo = document.createElement("div");
            nextInfo.classList.add("next-info");
            nextDayDiv.appendChild(nextInfo);
            //day 
            let pNextDay = document.createElement("p");
            nextInfo.appendChild(pNextDay);
            pNextDay.innerText = weekdayList[findDay(i)]+", "+Number(yesterdayDate.getDate()+i);
            //temperature 
            let pNextTemp = document.createElement("p");
            nextInfo.appendChild(pNextTemp);
            pNextTemp.innerText = el.main.temp+"°";
            //Description
            let pNextDescription = document.createElement("p");
            nextInfo.appendChild(pNextDescription);
            pNextDescription.innerText = el.weather[0].main+" / "+el.weather[0].description;
    
            i++;
        });
    }).catch(error => {
        console.log("There was an error with the second url api!", error);
    });
});
