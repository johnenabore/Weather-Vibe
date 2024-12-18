
class Weather {
  apiKey: string;
  cityInput: HTMLInputElement;
  date: any
  index: number;
  emoticon: string;
  id: number;
  timerID: any
  setTime: string;
  sunHorizon: number;
  constructor() {
    this.cityInput = document.getElementById("text") as HTMLInputElement;
    this.apiKey = "442aaf9af77a1d59eb8b81d858ce57d4";
    this.date;
    this.index = 2;
    this.emoticon = ""
    this.id = 0;
    this.timerID = 0;
    this.setTime = "";
    this.sunHorizon = 0;
  }
  async getAPI() {
    let lat: number = 0;
    let lon: number = 0;
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${this.cityInput.value}&appid=${this.apiKey}`
      );
      if (!response.ok) {
        console.log("failed to fetch");
        return;
      }
      const data = await response.json();
      this.date = data.dt;

      lat = data.coord.lat
      lon = data.coord.lon

      const responseII = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
      if (!responseII.ok) {
        console.log("Failed to fetch");
        return;
      }
      const dataII = await responseII.json();
      console.log(dataII)

      this.updateUI(data, dataII);

    } catch (err) {
      console.log(err);
    }
  }
  updateUI(data: any, dataII: any) {
    this.setSunset(dataII);
    this.setHumid(data);
    this.setCityName(data);
    this.setTempCelsius(data);
    this.setWind(data);
    this.setWeatherEmoticon(data);
    this.setFeelsLike(data);
    this.setCountryName(data)
    this.setSunrise(dataII);
    this.setWindBanner(data);
    this.advanceForecast(dataII);
    this.setCountryTime(data)

    if(this.timerID){
      clearInterval(this.timerID)
    }
    this.timerID = setInterval(() => {
      this.setSunset(dataII);
      this.setHumid(data);
      this.setCityName(data);
      this.setTempCelsius(data);
      this.setWind(data);
      this.setWeatherEmoticon(data);
      this.setFeelsLike(data);
      this.setCountryName(data)
      this.setSunrise(dataII);
      this.setWindBanner(data);
      this.advanceForecast(dataII);
      this.setCountryTime(data)
      }, 1000);
    console.log(data);

    this.addZoomEffect(".predictWeatherContainer")
    this.addZoomEffect('#sunRiseSetContainer')
    this.addZoomEffect("#emoticonWeather");
    this.addZoomEffect("#temp");
    this.addZoomEffect("#cityName");
    this.addZoomEffect("#humidContainer");
    this.addZoomEffect("#windContainer");
    this.addZoomEffect("#feelsLikeContainer");
    this.addZoomEffect("#windContentContainer")
    this.addZoomEffect("#countryName")

    this.addSlideDownEffect("card");
  }
  advanceForecast(dataII: any) {
    const forecastItemsContainer = document.querySelector('.forecastItemsContainer') as HTMLDivElement;
  
    this.index = 2; // Reset index for new city search
    forecastItemsContainer.innerHTML = ""; // Clear old data
  
    while (this.index <= 40) {
      const isDaytime = dataII.list[this.index].dt > dataII.city.sunrise && dataII.list[this.index].dt < dataII.city.sunset
      this.determineEmoticon(isDaytime);

      this.id = dataII.list[this.index].weather[0].id;
  
      const readableDate = dataII.list[this.index].dt_txt;
      const date = new Date(readableDate);
  
      const options: Intl.DateTimeFormatOptions = { weekday: 'short' };
      const weekday = date.toLocaleDateString('en-US', options);
  
      const getWeather = dataII.list[this.index].main.temp - 273.15;
      const setWeather = getWeather.toFixed(0);

      const forcastText = document.querySelector(".forcastText") as HTMLParagraphElement;
      forcastText.innerHTML = "5 DAYS FORECAST AS OF: " + readableDate.slice(-8)
  
      const forecastItemContainer = document.createElement('div');
      forecastItemContainer.classList.add('forecastContainer');
  
      const calendarDate = document.createElement('p');
      calendarDate.classList.add('calendarDate');
      calendarDate.innerHTML =  weekday
  
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
  
      addZoomEffect(elements: any) {
    const element = document.querySelector(elements);
    const dummy = document.getElementById('dummyPrompt') as HTMLInputElement
    dummy.style.display = 'none'
    const bgVideo = document.getElementById("background-video") as HTMLInputElement
    bgVideo.style.display = 'none'

    if (element) {
      element.style.display = "flex";
      element.classList.add("zoom-in");
      element.addEventListener("animationend", () => {
        element.classList.remove("zoom-in");
      });
    }
  }
  addSlideDownEffect(elementId: any) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add("slide-down");
      element.addEventListener("animationend", () =>
        element.classList.remove("slide-down")
      );
    }
  }
  setTempCelsius(temp: any) {
    const convertedCelsius = temp.main.temp - 273.15;
    const tempDisplay = document.getElementById("temp") as HTMLParagraphElement;
    tempDisplay.innerHTML = convertedCelsius.toFixed(1) + "℃";
  }
  setCityName(city: any) {
    const nameDisplay = document.getElementById(
      "cityName"
    ) as HTMLParagraphElement;
    nameDisplay.innerHTML = city.name;
  }
  setHumid(humid: any) {
    const humidDisplay = document.getElementById(
      "humid"
    ) as HTMLParagraphElement;
    humidDisplay.innerHTML = humid.main.humidity + "%";
    const humidText = document.getElementById(
      "humidText"
    ) as HTMLParagraphElement;
    humidText.innerHTML = "Humidity";
    const humidImage = document.getElementById(
      "humidImage"
    ) as HTMLImageElement;
    humidImage.src = "images/humid.png";
  }
  setWind(wind: any) {
    const windDisplay = document.getElementById("wind") as HTMLParagraphElement;
    windDisplay.innerHTML = wind.wind.speed;
    const windSpeedText = document.getElementById(
      "windSpeedText"
    ) as HTMLParagraphElement;
    windSpeedText.innerHTML = "Wind Speed";
    const windImage = document.getElementById("windImage") as HTMLImageElement;
    windImage.src = "images/wind.png";
  }
  determineEmoticon(isDaytime: boolean) {
    if (isDaytime) {
      // Daytime conditions
      if (this.id >= 200 && this.id <= 299) {
        this.emoticon = "⛈️"; // Thunderstorm
      } else if (this.id >= 300 && this.id <= 399) {
        this.emoticon = "🌧️"; // Light rain
      } else if (this.id >= 500 && this.id <= 599) {
        this.emoticon = "🌧️"; // Rain
      } else if (this.id >= 600 && this.id <= 699) {
        this.emoticon = "❄️"; // Snow
      } else if (this.id >= 700 && this.id <= 799) {
        this.emoticon = "🌫️"; // Mist/fog
      } else if (this.id === 800) {
        this.emoticon = "🌞"; // Clear sky (Day)
      } else if (this.id === 801) {
        this.emoticon = "🌤️"; // Few clouds (Day)
      } else if (this.id === 802) {
        this.emoticon = "⛅"; // Scattered clouds (Day)
      } else if (this.id === 803) {
        this.emoticon = "☁️"; // Broken clouds (Day)
      } else if (this.id === 804) {
        this.emoticon = "☁️"; // Overcast clouds (Day)
      }
    } else {
      // Nighttime conditions
      if (this.id >= 200 && this.id <= 299) {
        this.emoticon = "🌩️"; // Thunderstorm (Night)
      } else if (this.id >= 300 && this.id <= 399) {
        this.emoticon = "🌧️"; // Light rain (Night)
      } else if (this.id >= 500 && this.id <= 599) {
        this.emoticon = "🌧️"; // Rain (Night)
      } else if (this.id >= 600 && this.id <= 699) {
        this.emoticon = "❄️"; // Snow (Night)
      } else if (this.id >= 700 && this.id <= 799) {
        this.emoticon = "🌫️"; // Mist/fog (Night)
      } else if (this.id === 800) {
        this.emoticon = "🌙"; // Clear sky (Night)
      } else if (this.id === 801) {
        this.emoticon = "🌙"; // Few clouds (Night)
      } else if (this.id === 802) {
        this.emoticon = "🌙"; // Scattered clouds (Night)
      } else if (this.id === 803) {
        this.emoticon = "☁️"; // Broken clouds (Night)
      } else if (this.id === 804) {
        this.emoticon = "☁️"; // Overcast clouds (Night)
      }
    }
  }
  
  setWeatherEmoticon(data: any) {
    const isDaytime = data.dt > data.sys.sunrise && data.dt < data.sys.sunset;
    this.id = data.weather[0].id
    this.determineEmoticon(isDaytime);
    const displayEmoticon = document.getElementById(
      "emoticonWeather"
    ) as HTMLParagraphElement;

    if (displayEmoticon) {
      displayEmoticon.innerHTML = this.emoticon;
    }
  }
  setFeelsLike(data: any) {
    const feelsLikeText = document.getElementById(
      "feelsLikeText"
    ) as HTMLParagraphElement;
    feelsLikeText.innerHTML = "FEELS LIKE";

    const feelsLikeimg = document.getElementById(
      "feelsLikeimg"
    ) as HTMLImageElement;
    feelsLikeimg.src = "images/temp.png";

    const feelsLike = document.getElementById(
      "feelsLike"
    ) as HTMLParagraphElement;
    const convertedCelsius = data.main.feels_like - 273.15;
    feelsLike.innerHTML = convertedCelsius.toFixed(1) + "°";

    const feelsLikeDescription = document.getElementById(
      "feelsLikeDescription"
    ) as HTMLParagraphElement;
    let description = "";

    if (data.main.feels_like >= data.main.temp) {
      description = "It feels warmer than the actual temperature.";
    } else if (data.main.feels_like <= data.main.temp) {
      description = "It feels cooler than the actual temperature.";
    } else if (data.main.feels_like == data.main.temp) {
      description = "Similar to the actual temparature.";
    }

    if (description) {
      feelsLikeDescription.innerHTML = description;
    }
  }
  async setCountryName(data: any){
    const getName = await fetch('codes.json')
    const returnName = await getName.json();

    const countryCode = data.sys.country;
    returnName.forEach((element: any) => {
      if(countryCode !== element.code){
        return;
      }
    const displayCountry = document.getElementById('countryName') as HTMLParagraphElement
    displayCountry.innerHTML = '(' + element.name + ')';
    });
  }
  determineHorizon(data: any){
    let countryOffset = data.city.timezone;
    const philippineOffset = 28800;
    let setDifference = countryOffset - philippineOffset
    let calulateTime = this.sunHorizon + (setDifference * 1000)
    let countryTime = new Date(calulateTime);


    this.setTime = countryTime.toLocaleString('en-PH');
  }
  setSunrise(data: any){
    const riseSetimg = document.getElementById('riseSetimg') as HTMLImageElement
    riseSetimg.src = 'images/sunrise.png'

    const sunriseText = document.getElementById('riseSetText') as HTMLParagraphElement
    sunriseText.innerHTML = 'Sunrise'

    const timeRise = document.getElementById('timeRise') as HTMLParagraphElement;    
  
    this.sunHorizon = data.city.sunrise * 1000
    this.determineHorizon(data)
    timeRise.innerHTML = this.setTime.slice(-10);
  }
  setSunset(data: any){
    this.sunHorizon = data.city.sunset * 1000

    this.determineHorizon(data);

    const sunset = document.getElementById("sunset") as HTMLParagraphElement

    sunset.innerHTML = 'Sunset: ' + this.setTime.slice(-10);

    const PST = document.getElementById('pst') as HTMLParagraphElement
  }
  setWindBanner(data: any){
    const windSpeed = data.wind.speed * 3.6
    const gusts = data.wind.gust * 3.6

    const windContentContainer = document.getElementById('windContentContainer') as HTMLParagraphElement
    windContentContainer.style.display = 'flex'

    const windkmh = document.getElementById('windkmh') as HTMLParagraphElement
    windkmh.innerHTML = windSpeed.toFixed(0) + ' km/h';

    const gustkmh = document.getElementById('gustkmh') as HTMLParagraphElement;
    gustkmh.innerHTML = gusts.toFixed(0) + ' km/h';

    const directionkmh = document.getElementById('directionkmh') as HTMLParagraphElement

    let windValue = document.getElementById('windValue') as HTMLParagraphElement

    const degree = data.wind.deg
    let directionString = ''
    if(degree >= 0 && degree < 22.5 || degree >= 337.5){
      directionString = degree +'° (N)'
    }
    else if(degree >= 22.5 && degree < 67.5){
      directionString = degree +'° (NE)'
    }
    else if(degree >= 67.5 && degree < 112.5){
      directionString = degree +'° (E)'
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
    directionString = degree +"° (NW)";
    }

    if(directionkmh){
      directionkmh.innerHTML = directionString;
    }
    windValue.innerHTML = windSpeed.toFixed(0);
  }
  setCountryTime(data: any) {
    const countryOffset = data.timezone;
    const localTime = new Date();
    const philippineOffset = 28800;
    let calulateTime = localTime.getTime() + (countryOffset - philippineOffset) * 1000;
    let countryTime = new Date(calulateTime);
    let setTime = countryTime.toLocaleString('en-PH');
    
    const setCountryTime = document.querySelector('#timeDisplay') as HTMLParagraphElement;
    
    if (setCountryTime) {
      setCountryTime.innerHTML = setTime;
    }
    
  }
  
}
const cityInput = document.getElementById("button") as HTMLInputElement;
const weather = new Weather();
if (cityInput) {
  cityInput.addEventListener("click", () => weather.getAPI());
}