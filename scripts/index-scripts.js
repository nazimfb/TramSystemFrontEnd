function showAllStops() {
  fetch("http://localhost:8080/api/v1/stops")
    .then((response) => response.json())
    .then((data) => {
      // Iterate through the list of stops and add markers to the map
      data.forEach((stop) => {
        const marker = new google.maps.Marker({
          position: { lat: stop.latitude, lng: stop.longitude },
          map: map, // Assuming 'map' is your Google Map object
          icon: "stop_icon.svg", // Path to your marker icon
          animation: google.maps.Animation.DROP, // Optional: Add animation to markers
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching stops:", error);
    });
}

function findClosestStop() {
  // Get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      var userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      // Fetch tram stops from API
      fetch("http://localhost:8080/api/v1/stops")
        .then((response) => response.json())
        .then((data) => {
          // Find the closest tram stop
          var closestStop = findClosestStopToUser(data, userLocation);

          // Display the closest tram stop on the map
          displayClosestStop(closestStop);
        })
        .catch((error) => console.error("Error fetching tram stops:", error));
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function findClosestStopToUser(stops, userLocation) {
  var closestStop = null;
  var closestDistance = Number.MAX_VALUE;

  stops.forEach((stop) => {
    var stopLocation = {
      lat: stop.latitude,
      lng: stop.longitude,
    };
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(userLocation.lat, userLocation.lng),
      new google.maps.LatLng(stopLocation.lat, stopLocation.lng)
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestStop = stop;
    }
  });

  return closestStop;
}

function displayClosestStop(stop) {
  // Assuming you have a map object created in your map-script.js
  var marker = new google.maps.Marker({
    position: { lat: stop.latitude, lng: stop.longitude },
    map: map,
    title: stop.name,
  });

  // Optionally, you can center the map on the closest stop
  map.setCenter(marker.getPosition());
}

function redirectToLogin() {
  window.location.href = "/html/auth-login.html";
}

function redirectToRegister() {
  window.location.href = "/html/auth-register.html";
}

function redirectToDashboard() {
  window.location.href = "/html/map.html";
}

function logoutAndRefresh() {
  logout();
  location.reload();
}

function showUserButtons() {
  const isAuthenticated = checkAuthentication();
  if (isAuthenticated) {
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("register-btn").style.display = "none";
    document.getElementById("dashboard-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "block";
  } else {
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("register-btn").style.display = "block";
    document.getElementById("dashboard-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "none";
  }
}

window.onload = showUserButtons;

document.getElementById("login-btn").addEventListener("click", redirectToLogin);
document
  .getElementById("register-btn")
  .addEventListener("click", redirectToRegister);
document
  .getElementById("dashboard-btn")
  .addEventListener("click", redirectToDashboard);
document
  .getElementById("logout-btn")
  .addEventListener("click", logoutAndRefresh);
