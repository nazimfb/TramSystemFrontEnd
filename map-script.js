let map;
let directionsService;
let directionsRenderer;
let drawingManager;
let drawnPolyline;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.39461898803711, lng: 49.87601852416992 },
    zoom: 12,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
}

window.onload = function () {
  if (typeof google === "object" && typeof google.maps === "object") {
    initMap();
  } else {
    // Load the Google Maps API asynchronously
    // const script = document.createElement("script");
    // script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing&callback=initMap";
    // document.body.appendChild(script);
  }
};

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
