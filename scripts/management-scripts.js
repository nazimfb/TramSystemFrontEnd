async function fetchData(endpoint) {
  const accessToken = localStorage.getItem("accessToken");
  const requestOptions = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/${endpoint}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch data from ${endpoint}: ${error.message}`);
  }
}

async function manageEntity(entity) {
  try {
    const data = await fetchData(entity);
    populateList(data);
  } catch (error) {
    console.error(error);
  }
}

function populateList(data) {
  const listContainer = document.getElementById("entity-list");
  listContainer.innerHTML = ""; // Clear previous list

  data.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.textContent = JSON.stringify(item); // You can format this according to your needs
    listContainer.appendChild(listItem);
  });
}

function redirectToMap() {
  window.location.href = "/html/map.html";
}
