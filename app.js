window.addEventListener('load', () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const api = `https://api.darksky.net/forecast/18013269f886ca9c1a015f535bdd9a40/${long},${lat}`;

      fetch(api)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    });
  }
});
