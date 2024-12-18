"use strict";
class Weather {
    constructor() {
        this.cityInput = document.getElementById("text");
        this.apiKey = "442aaf9af77a1d59eb8b81d858ce57d4";
        this.date;
        this.index = 2;
        this.emoticon = "";
        this.id = 0;
        this.timerID = 0;
        this.setTime = "";
        this.sunHorizon = 0;
    }
    async getAPI() {
        let lat = 0;
        let lon = 0;
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.cityInput.value}&appid=${this.apiKey}`);
            if (!response.ok) {
                console.log("failed to fetch");
                return;
            }
            const data = await response.json();
            this.date = data.dt;
            lat = data.coord.lat;
            lon = data.coord.lon;
            const responseII = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
            if (!responseII.ok) {
                console.log("Failed to fetch");
                return;
            }
            const dataII = await responseII.json();
            console.log(dataII);
            this.updateUI(data, dataII);
        }
        catch (err) {
            console.log(err);
        }
    }
    updateUI(data, dataII) {
        this.setSunset(dataII);
        this.setHumid(data);
        this.setCityName(data);
        this.setTempCelsius(data);
        this.setWind(data);
        this.setWeatherEmoticon(data);
        this.setFeelsLike(data);
        this.setCountryName(data);
        this.setSunrise(dataII);
        this.setWindBanner(data);
        this.advanceForecast(dataII);
        this.setCountryTime(data);
        if (this.timerID) {
            clearInterval(this.timerID);
        }
        this.timerID = setInterval(() => {
            this.setSunset(dataII);
            this.setHumid(data);
            this.setCityName(data);
            this.setTempCelsius(data);
            this.setWind(data);
            this.setWeatherEmoticon(data);
            this.setFeelsLike(data);
            this.setCountryName(data);
            this.setSunrise(dataII);
            this.setWindBanner(data);
            this.advanceForecast(dataII);
            this.setCountryTime(data);
        }, 1000);
        console.log(data);
        this.addZoomEffect(".predictWeatherContainer");
        this.addZoomEffect('#sunRiseSetContainer');
        this.addZoomEffect("#emoticonWeather");
        this.addZoomEffect("#temp");
        this.addZoomEffect("#cityName");
        this.addZoomEffect("#humidContainer");
        this.addZoomEffect("#windContainer");
        this.addZoomEffect("#feelsLikeContainer");
        this.addZoomEffect("#windContentContainer");
        this.addZoomEffect("#countryName");
        this.addSlideDownEffect("card");
    }
    advanceForecast(dataII) {
        const forecastItemsContainer = document.querySelector('.forecastItemsContainer');
        this.index = 2;
        forecastItemsContainer.innerHTML = "";
        while (this.index <= 40) {
            const isDaytime = dataII.list[this.index].dt > dataII.city.sunrise && dataII.list[this.index].dt < dataII.city.sunset;
            this.determineEmoticon(isDaytime);
            this.id = dataII.list[this.index].weather[0].id;
            const readableDate = dataII.list[this.index].dt_txt;
            const date = new Date(readableDate);
            const options = { weekday: 'short' };
            const weekday = date.toLocaleDateString('en-US', options);
            const getWeather = dataII.list[this.index].main.temp - 273.15;
            const setWeather = getWeather.toFixed(0);
            const forcastText = document.querySelector(".forcastText");
            forcastText.innerHTML = "5 DAYS FORECAST AS OF: " + readableDate.slice(-8);
            const forecastItemContainer = document.createElement('div');
            forecastItemContainer.classList.add('forecastContainer');
            const calendarDate = document.createElement('p');
            calendarDate.classList.add('calendarDate');
            calendarDate.innerHTML = weekday;
            const emoticonForecast = document.createElement('p');
            emoticonForecast.classList.add('emoticonForecast');
            emoticonForecast.innerHTML = this.emoticon;
            const weatherForecast = document.createElement('p');
            weatherForecast.classList.add('weatherForecast');
            weatherForecast.innerHTML = setWeather + '°';
            forecastItemContainer.appendChild(calendarDate);
            forecastItemContainer.appendChild(emoticonForecast);
            forecastItemContainer.appendChild(weatherForecast);
            forecastItemsContainer.appendChild(forecastItemContainer);
            this.index += 8;
        }
    }
    addZoomEffect(elements) {
        const element = document.querySelector(elements);
        const dummy = document.getElementById('dummyPrompt');
        dummy.style.display = 'none';
        const bgVideo = document.getElementById("background-video");
        bgVideo.style.display = 'none';
        if (element) {
            element.style.display = "flex";
            element.classList.add("zoom-in");
            element.addEventListener("animationend", () => {
                element.classList.remove("zoom-in");
            });
        }
    }
    addSlideDownEffect(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add("slide-down");
            element.addEventListener("animationend", () => element.classList.remove("slide-down"));
        }
    }
    setTempCelsius(temp) {
        const convertedCelsius = temp.main.temp - 273.15;
        const tempDisplay = document.getElementById("temp");
        tempDisplay.innerHTML = convertedCelsius.toFixed(1) + "℃";
    }
    setCityName(city) {
        const nameDisplay = document.getElementById("cityName");
        nameDisplay.innerHTML = city.name;
    }
    setHumid(humid) {
        const humidDisplay = document.getElementById("humid");
        humidDisplay.innerHTML = humid.main.humidity + "%";
        const humidText = document.getElementById("humidText");
        humidText.innerHTML = "Humidity";
        const humidImage = document.getElementById("humidImage");
        humidImage.src = "images/humid.png";
    }
    setWind(wind) {
        const windDisplay = document.getElementById("wind");
        windDisplay.innerHTML = wind.wind.speed;
        const windSpeedText = document.getElementById("windSpeedText");
        windSpeedText.innerHTML = "Wind Speed";
        const windImage = document.getElementById("windImage");
        windImage.src = "images/wind.png";
    }
    determineEmoticon(isDaytime) {
        if (isDaytime) {
            if (this.id >= 200 && this.id <= 299) {
                this.emoticon = "⛈️";
            }
            else if (this.id >= 300 && this.id <= 399) {
                this.emoticon = "🌧️";
            }
            else if (this.id >= 500 && this.id <= 599) {
                this.emoticon = "🌧️";
            }
            else if (this.id >= 600 && this.id <= 699) {
                this.emoticon = "❄️";
            }
            else if (this.id >= 700 && this.id <= 799) {
                this.emoticon = "🌫️";
            }
            else if (this.id === 800) {
                this.emoticon = "🌞";
            }
            else if (this.id === 801) {
                this.emoticon = "🌤️";
            }
            else if (this.id === 802) {
                this.emoticon = "⛅";
            }
            else if (this.id === 803) {
                this.emoticon = "☁️";
            }
            else if (this.id === 804) {
                this.emoticon = "☁️";
            }
        }
        else {
            if (this.id >= 200 && this.id <= 299) {
                this.emoticon = "🌩️";
            }
            else if (this.id >= 300 && this.id <= 399) {
                this.emoticon = "🌧️";
            }
            else if (this.id >= 500 && this.id <= 599) {
                this.emoticon = "🌧️";
            }
            else if (this.id >= 600 && this.id <= 699) {
                this.emoticon = "❄️";
            }
            else if (this.id >= 700 && this.id <= 799) {
                this.emoticon = "🌫️";
            }
            else if (this.id === 800) {
                this.emoticon = "🌙";
            }
            else if (this.id === 801) {
                this.emoticon = "🌙";
            }
            else if (this.id === 802) {
                this.emoticon = "🌙";
            }
            else if (this.id === 803) {
                this.emoticon = "☁️";
            }
            else if (this.id === 804) {
                this.emoticon = "☁️";
            }
        }
    }
    setWeatherEmoticon(data) {
        const isDaytime = data.dt > data.sys.sunrise && data.dt < data.sys.sunset;
        this.id = data.weather[0].id;
        this.determineEmoticon(isDaytime);
        const displayEmoticon = document.getElementById("emoticonWeather");
        if (displayEmoticon) {
            displayEmoticon.innerHTML = this.emoticon;
        }
    }
    setFeelsLike(data) {
        const feelsLikeText = document.getElementById("feelsLikeText");
        feelsLikeText.innerHTML = "FEELS LIKE";
        const feelsLikeimg = document.getElementById("feelsLikeimg");
        feelsLikeimg.src = "images/temp.png";
        const feelsLike = document.getElementById("feelsLike");
        const convertedCelsius = data.main.feels_like - 273.15;
        feelsLike.innerHTML = convertedCelsius.toFixed(1) + "°";
        const feelsLikeDescription = document.getElementById("feelsLikeDescription");
        let description = "";
        if (data.main.feels_like >= data.main.temp) {
            description = "It feels warmer than the actual temperature.";
        }
        else if (data.main.feels_like <= data.main.temp) {
            description = "It feels cooler than the actual temperature.";
        }
        else if (data.main.feels_like == data.main.temp) {
            description = "Similar to the actual temparature.";
        }
        if (description) {
            feelsLikeDescription.innerHTML = description;
        }
    }
    async setCountryName(data) {
        const getName = await fetch('codes.json');
        const returnName = await getName.json();
        const countryCode = data.sys.country;
        returnName.forEach((element) => {
            if (countryCode !== element.code) {
                return;
            }
            const displayCountry = document.getElementById('countryName');
            displayCountry.innerHTML = '(' + element.name + ')';
        });
    }
    determineHorizon(data) {
        let countryOffset = data.city.timezone;
        const philippineOffset = 28800;
        let setDifference = countryOffset - philippineOffset;
        let calulateTime = this.sunHorizon + (setDifference * 1000);
        let countryTime = new Date(calulateTime);
        this.setTime = countryTime.toLocaleString('en-PH');
    }
    setSunrise(data) {
        const riseSetimg = document.getElementById('riseSetimg');
        riseSetimg.src = 'images/sunrise.png';
        const sunriseText = document.getElementById('riseSetText');
        sunriseText.innerHTML = 'Sunrise';
        const timeRise = document.getElementById('timeRise');
        this.sunHorizon = data.city.sunrise * 1000;
        this.determineHorizon(data);
        timeRise.innerHTML = this.setTime.slice(-10);
    }
    setSunset(data) {
        this.sunHorizon = data.city.sunset * 1000;
        this.determineHorizon(data);
        const sunset = document.getElementById("sunset");
        sunset.innerHTML = 'Sunset: ' + this.setTime.slice(-10);
        const PST = document.getElementById('pst');
    }
    setWindBanner(data) {
        const windSpeed = data.wind.speed * 3.6;
        const gusts = data.wind.gust * 3.6;
        const windContentContainer = document.getElementById('windContentContainer');
        windContentContainer.style.display = 'flex';
        const windkmh = document.getElementById('windkmh');
        windkmh.innerHTML = windSpeed.toFixed(0) + ' km/h';
        const gustkmh = document.getElementById('gustkmh');
        gustkmh.innerHTML = gusts.toFixed(0) + ' km/h';
        const directionkmh = document.getElementById('directionkmh');
        let windValue = document.getElementById('windValue');
        const degree = data.wind.deg;
        let directionString = '';
        if (degree >= 0 && degree < 22.5 || degree >= 337.5) {
            directionString = degree + '° (N)';
        }
        else if (degree >= 22.5 && degree < 67.5) {
            directionString = degree + '° (NE)';
        }
        else if (degree >= 67.5 && degree < 112.5) {
            directionString = degree + '° (E)';
        }
        else if (degree >= 112.5 && degree < 157.5) {
            directionString = degree + "° (SE)";
        }
        else if (degree >= 157.5 && degree < 202.5) {
            directionString = degree + "° (S)";
        }
        else if (degree >= 202.5 && degree < 247.5) {
            directionString = degree + "° (SW)";
        }
        else if (degree >= 247.5 && degree < 292.5) {
            directionString = degree + "° (W)";
        }
        else if (degree >= 292.5 && degree < 337.5) {
            directionString = degree + "° (NW)";
        }
        if (directionkmh) {
            directionkmh.innerHTML = directionString;
        }
        windValue.innerHTML = windSpeed.toFixed(0);
    }
    setCountryTime(data) {
        const countryOffset = data.timezone;
        const localTime = new Date();
        const philippineOffset = 28800;
        let calulateTime = localTime.getTime() + (countryOffset - philippineOffset) * 1000;
        let countryTime = new Date(calulateTime);
        let setTime = countryTime.toLocaleString('en-PH');
        const setCountryTime = document.querySelector('#timeDisplay');
        if (setCountryTime) {
            setCountryTime.innerHTML = setTime;
        }
    }
}
const cityInput = document.getElementById("button");
const weather = new Weather();
if (cityInput) {
    cityInput.addEventListener("click", () => weather.getAPI());
}
