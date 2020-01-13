class DataHandler {
  static fetch(url, successCb, errorCb) {
    fetch(url)
      .then(res => res.json())
      .then(successCb)
      .catch(errorCb);
  }
}

class WeatherApp {
  constructor() {
    window.addEventListener('load', this.getLocalWeather);
  }

  getLocalWeather = () => {
    navigator.geolocation.getCurrentPosition(this.showWeather, this.showError);
  };

  showWeather = position => {
    this.handleSpinner('show');

    const lat = position.coords.latitude;
    const long = position.coords.longitude;

    const proxy = `https://cors-anywhere.herokuapp.com/`;
    const weatherApi = `${proxy}https://api.darksky.net/forecast/18013269f886ca9c1a015f535bdd9a40/${lat},${long}?units=si`;
    const locationApi = `${proxy}https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`;

    DataHandler.fetch(weatherApi, this.updateWeatherData, this.showError);
    DataHandler.fetch(locationApi, this.updateLocationData, this.showError);
  };

  updateWeatherData = data => {
    this.handleSpinner('hide');

    const temperatureValueContainer = document.getElementById(
      'app-bottom-tempValue'
    );
    const temperatureContainer = document.getElementById(
      'app-bottom-tempContainer'
    );
    const appContainer = document.getElementById('app');
    const iconContainer = document.getElementById('app-top-icon');
    const descriptionContainer = document.getElementById(
      'app-bottom-description'
    );
    const arrow = document.getElementById('app-bottom-arrow');
    const drawer = document.getElementById('app-drawer');
    const cloudCoverValue = document.getElementById('cloudcover_value');
    const humidityValue = document.getElementById('humidity_value');
    const pressureValue = document.getElementById('pressure_value');
    const flTemperatureValue = document.getElementById('fl-temperature_value');
    const windValue = document.getElementById('wind_value');
    const weatherForecast = document.querySelector('.app__drawer-forecast');
    const weatherForecastItems = document.querySelectorAll(
      '.app__drawer-forecast-item'
    );

    appContainer.classList.add('js-show');

    const timezone = data.timezone;
    const {
      summary,
      temperature,
      icon,
      apparentTemperature,
      humidity,
      pressure,
      windSpeed,
      cloudCover
    } = data.currently;
    const weatherForecastData = data.daily.data;

    weatherForecastData.forEach((data, index) => {
      const date = new Date(data.time * 1000).toLocaleString('en-us', {
        day: '2-digit',
        month: 'short',
        weekday: 'short'
      });

      const itemContent = `
              <p class="app__drawer-forecast-item-date">${date}</p>
              <canvas class="app__drawer-forecast-item-icon" width="45" height="45"></canvas>
              <p class="app__drawer-forecast-item-temp">${Math.round(
                data.temperatureMin
              )}&deg;C - ${Math.round(data.temperatureMax)}&deg;C</p>
            `;

      weatherForecastItems[index].insertAdjacentHTML('afterbegin', itemContent);

      const icon = weatherForecastItems[index].querySelector(
        '.app__drawer-forecast-item-icon'
      );

      this.setIcon(data.icon, icon);
    });

    temperatureValueContainer.textContent = Math.round(temperature);
    descriptionContainer.textContent = summary;
    cloudCoverValue.textContent = `${cloudCover * 100}%`;
    humidityValue.textContent = `${humidity * 100}%`;
    pressureValue.textContent = `${pressure} hPa`;
    flTemperatureValue.textContent = `${apparentTemperature} \xB0C`;
    windValue.textContent = `${windSpeed} m/s`;
    this.setIcon(icon, iconContainer);
    this.setBackground(icon);

    temperatureContainer.addEventListener(
      'click',
      this.handleTemperatureConvertion.bind(
        null,
        temperature,
        temperatureValueContainer
      )
    );

    arrow.addEventListener('click', () => {
      drawer.classList.toggle('js-show');
      arrow.classList.toggle('js-open');
    });
  };

  updateLocationData = data => {
    const locationContainer = document.getElementById('app-top-location');
    const { locality, countryName, continent } = data;
    locationContainer.textContent = `${locality}, ${countryName}`;
  };

  showError = err => {
    const errorBox = document.getElementById('error');
    this.hideHint();
    errorBox.classList.add('js-show');
  };

  handleSpinner = command => {
    const appTop = document.getElementById('app-top');
    const appBottom = document.getElementById('app-bottom');

    if (command === 'show') {
      document.body.classList.add('spinner');
      appTop.style.display = 'none';
      appBottom.style.display = 'none';
    } else {
      document.body.classList.remove('spinner');
      appTop.style.display = 'flex';
      appBottom.style.display = 'flex';
      this.hideHint();
    }
  };

  hideHint = () => {
    const hintBox = document.getElementById('hint');
    hintBox.classList.add('js-hide');
  };

  handleTemperatureConvertion = (temperature, temperatureContainer) => {
    const temperatureSymbol = document.getElementById('app-bottom-tempSymbol');
    if (temperatureSymbol.textContent === 'C') {
      temperatureContainer.textContent = Math.round((9 / 5) * temperature + 32);
      temperatureSymbol.textContent = 'F';
    } else {
      temperatureContainer.textContent = Math.round(temperature);
      temperatureSymbol.textContent = 'C';
    }
  };

  setBackground = icon => {
    let background;
    switch (icon) {
      case 'clear-day':
        background = './images/bg/clear_day.jpg';
        break;
      case 'clear-night':
        background = './images/bg/clear_night.jpg';
        break;
      case 'rain':
        background = './images/bg/rain.jpg';
        break;
      case 'snow':
        background = './images/bg/snow.jpg';
        break;
      case 'sleet':
        background = './images/bg/sleet.jpg';
        break;
      case 'wind':
        background = './images/bg/wind.jpg';
        break;
      case 'fog':
        background = './images/bg/fog.jpg';
        break;
      case 'cloudy':
        background = './images/bg/cloudy.jpg';
        break;
      case 'partly-cloudy-day':
        background = './images/bg/partly_cloudy_day.jpg';
        break;
      case 'partly-cloudy-night':
        background = './images/bg/partly_cloudy_night.jpg';
        break;
      default:
        background = './images/bg/og_bg.jpg';
    }
    document.body.style.background = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${background}) no-repeat center center/cover`;
  };

  setIcon = (icon, iconID) => {
    const skycons = new Skycons({ color: '#56a6e7' });
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  };
}

const weather = new WeatherApp();
