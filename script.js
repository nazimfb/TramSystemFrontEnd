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

  drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYLINE,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [google.maps.drawing.OverlayType.POLYLINE],
    },
    polylineOptions: {
      editable: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    },
  });

  google.maps.event.addListener(drawingManager, "polylinecomplete", function (
    polyline
  ) {
    if (drawnPolyline) {
      drawnPolyline.setMap(null);
    }
    drawnPolyline = polyline;
    drawnPolyline.setMap(map);

    const path = drawnPolyline.getPath();
    const waypoints = path.getArray().map(function (latLng) {
      return { location: latLng };
    });

    const requestData = {
      origin: waypoints[0].location,
      destination: waypoints[waypoints.length - 1].location,
      waypoints: waypoints.slice(1, -1),
      travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(requestData, function (response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    });
  });

  drawingManager.setMap(map);
}

window.onload = function () {
  if (typeof google === "object" && typeof google.maps === "object") {
    // Google Maps API has already been loaded
    initMap();
  } else {
    // Load the Google Maps API asynchronously
    // const script = document.createElement("script");
    // script.src = "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=drawing&callback=initMap";
    // document.body.appendChild(script);
  }
};

function deleteLine() {
  if (drawnPolyline) {
    drawnPolyline.setMap(null);
    drawnPolyline = null;
  }
  directionsRenderer.setDirections({ routes: [] }); // Clear directions
}

function createRoute() {
  if (!drawnPolyline || drawnPolyline.getPath().getLength() < 2) {
    window.alert("Route must have at least two points");
    return;
  }

  const routeName = prompt("Enter the name of the route:");
  if (!routeName) {
    window.alert("Route name cannot be empty.");
    return;
  }

  const path = drawnPolyline.getPath();
  const waypoints = path.getArray().map(function (latLng) {
    return { location: latLng };
  });

  const requestData = {
    name: routeName,
    waypoints: waypoints,
  };

  fetch("http://localhost:8080/api/v1/routes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Route created successfully:", data);
      window.alert("Route created successfully: " + JSON.stringify(data));
    })
    .catch((error) => {
      console.error("Error creating route:", error);
      window.error("Error creating route:", error);
    });
}
