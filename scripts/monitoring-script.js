function monitorActiveTrams() {
  // Send GET request to fetch active tram locations
  setInterval(() => {
    const accessToken = localStorage.getItem("accessToken");
    const requestOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    fetch("http://localhost:8080/api/v1/trams/active", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch active trams");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Active trams:", data);
        renderTramMarkers(data);
      })
      .catch((error) => console.error("Error fetching tram locations:", error));
  }, 5000); // Fetch tram locations every 5 seconds
}

function renderTramMarkers(trams) {
  // Remove existing tram markers from the map
  tramMarkers.forEach((marker) => marker.setMap(null));
  tramMarkers = [];

  // Add new markers for each tram's location
  trams.forEach((tram) => {
    const icon = {
      url: "./tram_icon.png",
      scaledSize: new google.maps.Size(32, 32), // Adjust the size as needed
    };

    const marker = new google.maps.Marker({
      position: { lat: tram.latitude, lng: tram.longitude },
      map: map,
      icon: icon,
    });
    tramMarkers.push(marker);
  });
}

const directionRenderers = [];

function monitorRoutes() {
  const accessToken = localStorage.getItem("accessToken");
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  fetch("http://localhost:8080/api/v1/routes/waypoints", requestOptions)
    .then((response) => response.json())
    .then((routes) => {
      // Iterate over each route
      routes.forEach((route) => {
        if (route.waypoints.length > 0) {
          const waypoints = route.waypoints.map((waypoint) => ({
            location: new google.maps.LatLng(waypoint.lat, waypoint.lng),
          }));

          const requestData = {
            origin: waypoints[0].location,
            destination: waypoints[waypoints.length - 1].location,
            waypoints: waypoints.slice(1, -1),
            travelMode: google.maps.TravelMode.DRIVING,
          };

          // Create a new DirectionsRenderer for each route
          const directionsRenderer = new google.maps.DirectionsRenderer();
          directionsRenderer.setMap(map); // Assuming 'map' is your Google Map instance

          directionRenderers.push(directionsRenderer); // Store the renderer for later use

          directionsService.route(requestData, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(response);
            } else {
              console.error(
                "Directions request failed for route ID " +
                  route.id +
                  " due to " +
                  status
              );
            }
          });
        } else {
          console.error("Route with ID " + route.id + " has no waypoints.");
        }
      });
    })
    .catch((error) => console.error("Error fetching routes:", error));
}

function stopMonitoringAndClearMap() {
  // Clear the map
  directionRenderers.forEach((directionRenderer) => {
    directionRenderer.setDirections({ routes: [] });
  });
}


function stopMonitoringTrams() {
  // Clear the interval used for monitoring active trams
  clearInterval(tramInterval);
  // Clear existing tram markers from the map
  tramMarkers.forEach((marker) => marker.setMap(null));
  tramMarkers = [];
}

function redirectToManagement() {
  window.location.href = "/html/management.html";
}