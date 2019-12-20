const appContainer = document.querySelector('.app');
const appTip = document.querySelector('.app__tip');
const appTop = document.querySelector('.app__top');
const appBottom = document.querySelector('.app__bottom');
const timezoneContainer = document.querySelector('.app__top-timezone');
const iconContainer = document.querySelector('.app__top-icon');
const descriptionContainer = document.querySelector('.app__bottom-description');
const temperatureContainer = document.querySelector(
  '.app__bottom-tempContainer'
);
const temperatureValueContainer = document.querySelector(
  '.app__bottom-tempValue'
);
const temperatureSymbol = document.querySelector('.app__bottom-tempSymbol');
const arrow = document.querySelector('.app__bottom-arrow');
const drawer = document.querySelector('.app__drawer');
const cloudCoverValue = document.getElementById('cloudcover_value');
const humidityValue = document.getElementById('humidity_value');
const pressureValue = document.getElementById('pressure_value');
const flTemperatureValue = document.getElementById('fl-temperature_value');
const windValue = document.getElementById('wind_value');

window.addEventListener('load', getLocalWeather);

function getLocalWeather() {
  handleSpinner('show');
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      lat = position.coords.latitude;
      long = position.coords.longitude;

      // Some problem with the api, to use it we have to use proxy
      const proxy = `https://cors-anywhere.herokuapp.com/`;
      const api = `${proxy}https://api.darksky.net/forecast/18013269f886ca9c1a015f535bdd9a40/${lat},${long}?units=si`;

      fetch(api)
        .then(res => res.json())
        .then(data => {
          console.log(data);
          handleSpinner('hide');
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

          timezoneContainer.textContent = timezone;
          temperatureValueContainer.textContent = Math.round(temperature);
          descriptionContainer.textContent = summary;
          cloudCoverValue.textContent = cloudCover;
          humidityValue.textContent = humidity;
          pressureValue.textContent = `${pressure} hPa`;
          flTemperatureValue.textContent = `${apparentTemperature} \xB0C`;
          windValue.textContent = `${windSpeed} m/s`;
          setIcon(icon, iconContainer);
          setBackground(icon);
          temperatureContainer.addEventListener(
            'click',
            handleTemperatureConvertion.bind(null, temperature)
          );
          arrow.addEventListener('click', () => {
            drawer.classList.toggle('js-shown');
            arrow.classList.toggle('js-opened');
          });
        })
        .catch(err => console.log(err));
    });
  }
}

function setIcon(icon, iconID) {
  const skycons = new Skycons({ color: '#56a6e7' });
  const currentIcon = icon.replace(/-/g, '_').toUpperCase();
  skycons.play();
  return skycons.set(iconID, Skycons[currentIcon]);
}

function setBackground(icon) {
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

  document.body.style.backgroundImage = `url(${background})`;
}

function handleTemperatureConvertion(temperature) {
  if (temperatureSymbol.textContent === 'C') {
    temperatureValueContainer.textContent = Math.round(
      (9 / 5) * temperature + 32
    );
    temperatureSymbol.textContent = 'F';
  } else {
    temperatureValueContainer.textContent = Math.round(temperature);
    temperatureSymbol.textContent = 'C';
  }
}

function handleSpinner(command) {
  if (command === 'show') {
    appContainer.classList.add('spinner');
    appTop.style.display = 'none';
    appBottom.style.display = 'none';
  } else {
    appContainer.classList.remove('spinner');
    appTop.style.display = 'flex';
    appBottom.style.display = 'flex';
    appTip.classList.add('js-hide');
  }
}
