// script.js

let map;
let directionsService;
let directionsRenderer;
let drawingManager;
let waypoints = [];
let drawnPolyline;

function initMap() {
  // Load styles from styles.css file
  fetch("styles.css")
    .then((response) => response.text())
    .then((cssText) => {
      // Create a new style element
      const style = document.createElement("style");
      style.type = "text/css";

      // Append CSS text to the style element
      if (style.styleSheet) {
        // For IE
        style.styleSheet.cssText = cssText;
      } else {
        // For other browsers
        style.appendChild(document.createTextNode(cssText));
      }

      // Append the style element to the document head
      document.head.appendChild(style);
    })
    .catch((error) => {
      console.error("Error loading CSS file:", error);
    });

  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.39461898803711, lng: 49.87601852416992 },
    zoom: 14,
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
      editable: true, // Allow editing of the polyline
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    },
  });

  google.maps.event.addListener(
    drawingManager,
    "polylinecomplete",
    function (polyline) {
      drawnPolyline = polyline;
    }
  );

  drawingManager.setMap(map);
}

function createRoute() {
  if (!drawnPolyline) {
    window.alert("Please draw a route first.");
    return;
  }

  const path = drawnPolyline.getPath();
  path.forEach(function (latLng) {
    waypoints.push({ lat: latLng.lat(), lng: latLng.lng() });
  });

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ waypoints }),
  };

  fetch("http://localhost:8080/api/v1/routes", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // Handle response data as needed
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
}
