function monitorActiveTrams() {
  // Send GET request to fetch active tram locations
  setInterval(() => {
    fetch("http://localhost:8080/api/v1/trams/active")
      .then((response) => response.json())
      .then((data) => {
        // Remove existing tram markers from the map
        // (Assuming you have stored tram markers in an array called tramMarkers)
        tramMarkers.forEach((marker) => marker.setMap(null));
        tramMarkers = [];

        // Add new markers for each tram's location
        data.forEach((tram) => {
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
      })
      .catch((error) => console.error("Error fetching tram locations:", error));
  }, 5000); // Fetch tram locations every 5 seconds
}

function monitorRoutes() {
    fetch("http://localhost:8080/api/v1/routes/waypoints")
      .then((response) => response.json())
      .then((routes) => {
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
  directionsRenderer.setDirections({ routes: [] });
}

function stopMonitoringTrams() {
    // Clear the interval used for monitoring active trams
    clearInterval(tramInterval);
    // Clear existing tram markers from the map
    tramMarkers.forEach(marker => marker.setMap(null));
    tramMarkers = [];
  }