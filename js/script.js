const cityInput = document.querySelector(".city-input")
const searchBtn = document.querySelector(".search-btn")
const apiKey = "e36ca5f6b7d8d4c545f126dc277439db"

const notFoundSection = document.querySelector(".not-found")
const searchCitySection = document.querySelector(".search-city")
const weatherInfoSection = document.querySelector(".weather-info")

const countryTxt = document.querySelector(".country-txt")
const tempTxt = document.querySelector(".temp-txt")
const conditionTxt = document.querySelector(".condition-txt")
const humidityValueTxt = document.querySelector(".Humidity-value-txt")
const windValueTxt = document.querySelector(".wind-value-txt")
const weatherSummaryImg = document.querySelector(".weather-summary-img")
const currentDateTxt = document.querySelector(".current-date-txt")

const forecastItemsContainer = document.querySelector(".forcast-items-container")

searchBtn.addEventListener("click" , ()=>{
    if(cityInput.value.trim() !=""){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
    
})

cityInput.addEventListener("keydown" , (event)=>{
    if(event.key == "Enter" && cityInput.value.trim() !="" ){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ""
        cityInput.blur()
    }
})

 async function getFetchData(endPoint , city){
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
    const response = await fetch(apiUrl)
    return response.json()
}


function getWeatherIcon(id){
   if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snowatmosphere.svg'
    if(id <= 781) return 'drizzle.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        weekday : 'short',
        day : '2-digit' ,
        month : 'short'
    }
     return currentDate.toLocaleDateString("en-GB" , options)
}



async function updateWeatherInfo(city){
    const weatherData = await getFetchData("weather" , city)
    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)


    const {
        name : country,
        main : {temp , humidity},
        weather :[{ id , main}],
        wind : {speed}
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + " °C"
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + "%"
    windValueTxt.textContent = speed + " M/s"

    currentDateTxt.textContent = getCurrentDate()
    // console.log(getCurrentDate())

    weatherSummaryImg.src = `images/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)


    showDisplaySection(weatherInfoSection)
}

 async function updateForecastsInfo(city){
    const forecastData = await getFetchData("forecast" , city)

    const timeTaken = "12:00:00"
    const todayDate = new Date().toISOString().split("T")[0]

    forecastItemsContainer.innerHTML = ""
    forecastData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken) && 
    !forecastWeather.dt_txt.includes(todayDate)){
        updateForecastItems(forecastWeather)

        }
        // console.log(forecastWeather)
    })
}

function updateForecastItems(weatherData){
    const {
        dt_txt : date,
        main : {temp},
        weather :[{ id}],
        // wind : {speed}
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day : '2-digit' ,
        month : 'short'
    }

    const dateResult = dateTaken.toLocaleDateString("en-US", dateOption)



    const forecastItem = `
    <div class="forcast-item">
        <h5 class="forcast-item-date regular-txt"> ${dateResult}</h5>
        <img src="images/${getWeatherIcon(id)}" alt="" class="forcast-item-img">
        <h5 class="forcast-item-temp">${Math.round(temp)} °C</h5>
    </div>
    `

    forecastItemsContainer.insertAdjacentHTML('beforeend' , forecastItem )

}



function showDisplaySection(section){
    [weatherInfoSection , searchCitySection , notFoundSection]
    .forEach(section => section.style.display="none")

    section.style.display="flex"

}