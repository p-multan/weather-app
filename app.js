window.addEventListener('load', () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      lat = position.coords.latitude;
      long = position.coords.longitude;

      // Some problem with the api, to use it we have to use proxy
      const proxy = `https://cors-anywhere.herokuapp.com/`;
      const api = `${proxy}https://api.darksky.net/forecast/18013269f886ca9c1a015f535bdd9a40/${lat},${long}`;

      fetch(api)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    });
  }
});
