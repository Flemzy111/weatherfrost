let lat = 6.44132;
let lon = 7.49883;
let cityName = 'Enugu'




/// fxn  fetch waether api
function fetchWeather(lat, lon) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=uv_index_max,weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m,weather_code,precipitation_probability&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,rain,weather_code,precipitation&timezone=auto`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            updateUI(data)

        })

}
fetchWeather(lat, lon)
///  fxn to select right weather
let weather = ''
function getweather(code) {
    if (code === 0) {
        return waether = {
            text: 'sunny',
            image: './images/sunny.png'

        }

    }
    if (code >= 1 && code <= 3) {
        return weather = {
            text: 'Pertly Cloudy',
            image: './images/cloudsunny.png'

        }

    }
    if (code >= 45 && code <= 48) {
        return weather = {
            text: 'Cloud',
            image: "./images/cloud.jpeg"
        }

    }
    if (code >= 51 && code <= 67) {
        return weather = {
            text: 'Rainy',
            image: './images/raining.jpeg'

        }

    }
    if (code >= 71 && code <= 77) {
        return weather = {
            text: 'snowy',
            image: '.images/snowy.png'
        }

    }
    if (code >= 80 && code <= 82) {
        return waether = {
            text: 'Rainy',
            image: './images/raining.jpeg'

        }
    }
    if (code >= 95 && code <= 99) {
        return waether = {
            text: 'storm',
            image: './images/storm.jpeg'
        }

    }


}


// fxn updates the ui

function updateUI(data) {
    // console.log(data);
    const daily = data.daily
    const hourly = data.hourly
    const current = data.current
    const display = document.querySelector('.display')
    const forecast = document.querySelector('.forcast')
    const flists = document.querySelector('.f-lists')
    const acDetails = document.querySelector('.ac-details')

    display.innerHTML = ''
    forecast.innerHTML = ''
    acDetails.innerHTML = ''
    const currentweather = getweather(current.weather_code)


    display.innerHTML = `<div class="loc">
                    <h2>${cityName}</h2>
                    <p>change of rain ${daily.precipitation_probability_max[0]}%</p>
                    <h1>${current.temperature_2m}<sup>o</sup></h1>
                </div>
                <div class="w-icon">
                    <img src="${currentweather.image}" alt="">

                </div>`
    acDetails.innerHTML = `<div class="left">
                        <div class="left-i">
                            <i class="fas fa-thermometer ac-icon"></i>
                            <div>
                                <p> Real Feal</p>
                                <h4>${Math.round(current.apparent_temperture)}<sup>o</sup></h4>
                            </div>
                        </div>

                        <div class="left-i">
                            <i class="fa-solid fa-droplet ac-icon"></i>
                            <div>
                                <p>Chance of rain</p>
                                <h4>${daily.precipitation_probability_max[0]}%</h4>
                            </div>
                        </div>


                    </div>
                    <div class="left">
                        <div class="left-i">
                            <i class="fa-solid fa-wind ac-icon"></i>
                            <div>
                                <p>Wind</p>
                                <h4>${current.wind_speed_10m}km/h</h4>
                            </div>
                        </div>

                        <div class="left-i">
                            <i class="fa-solid fa-sun ac-icon"></i>
                            <div>
                                <p>UV index</p>
                                <h4>${daily.uv_index_max[0]}</h4>
                            </div>
                        </div>

                    </div>`









    const hourIndex = [6, 9, 12, 15, 18, 21]

    hourIndex.forEach((hour) => {
        const hourTem = hourly.temperature_2m[hour]
        const hourweathercode = hourly.weather_code[hour]
        const hourweather = getweather(hourweathercode)
        const formattedhour = hour == 12 ? '12:00' : `${hour % 12}:00`
        const ampm = hour >= 12 ? 'PM' : 'AM'

        forecast.innerHTML += `<div class="f-time">
                        <p>${formattedhour + ampm}</p>
                        <img src="${hourweather.image}" alt="" class="f-image">
                        <h4>${hourTem}<sup>0</sup></h4>
                    </div>`


        /// 7-day


    })

    flists.innerHTML = ''
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat',]
    const todayIndex = new Date().getDay();
    // const todatIndex = 3;

    // console.log(todayIndex);

    for (let i = 0; i < 7; i++) {

        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = daily.temperature_2m_min[i];
        const dailyWeatherCode = daily.weather_code[i]

        const dailyWeather = getweather(dailyWeatherCode)

        let dayLabel = (i == 0) ? 'toady' : days[(todayIndex + i) % 7];


        // console.log(dayLabel + i);
        flists.innerHTML += ` <div class="f-list">
                <span>${dayLabel}</span>

                <div class="f-weather">
                    <img src="${dailyWeather.image}" alt="">
                    <span>${dailyWeather.text}</span>
                </div>

                <Span>${maxTemp}/${minTemp}</Span>
            </div>`






    }


}


// fx saerch 
const searchInput = document.querySelector('.search')
const searchResult = document.querySelector('.search-result')
searchInput.value = ''

searchInput.addEventListener('input', function (event) {
    const query = searchInput.value.trim()

    if (query.length < 3) {
        return

    }
    geoCodeTimeout = setTimeout(async () => {

        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`)
        if (!res.ok) return;

        const data = await res.json();
        // console.log(data);

        // display
        if (data.results && data.results.length > 0) {


            displaySearch(data.results)
        }
        else {
            searchResult.innerHTML = `<p class="no-loc">No location Found.</p>`
            searchResult.classList.add('show-search')

        }





    }, 500)


    // console.log(query);
})
function displaySearch(locations) {


    searchResult.innerHTML = ''
    // console.log(locations);

    locations.forEach((loc) => {
        searchResult.innerHTML += `<div class="option" onclick=' loadcity(${JSON.stringify(loc)})'>
                    <p>
                        <b class="city">${loc.name}</b>
                        ${loc.admin1 || loc.country}
                    </p>

                    <P class="country">${loc.country_code}</P>

                </div>`


    })
    searchResult.classList.add('show-search')// show search result

}
function loadcity(loc) {
    lat = loc.latitude
    lon = loc.longitude
    cityName = loc.name


    /// trigger the update
    fetchWeather(lat, lon)

    /// clear search input
    searchInput.value = ''
    searchResult.classList.remove('show-search')
}