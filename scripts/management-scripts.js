async function fetchData(method, entity, id = "") {
  const accessToken = localStorage.getItem("accessToken");
  const requestOptions = {
    method: method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  let url = `http://localhost:8080/api/v1/${entity}`;
  if (id) {
    url += `/${id}`;
  }

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch data from ${entity}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to fetch data from ${entity}: ${error.message}`);
  }
}

async function manageEntity(entity) {
  try {
    const data = await fetchData("GET", entity);
    populateList(data);
  } catch (error) {
    console.error(error);
  }
}

async function deleteEntity(id, entity) {
  const accessToken = localStorage.getItem("accessToken");
  const requestOptions = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };

  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/${entity}/${id}`,
      requestOptions
    );
    if (!response.ok) {
      throw new Error(`Failed to delete ${entity} with ID ${id}`);
    }
    // Refresh the entity list after deletion
    manageEntity(entity);
  } catch (error) {
    console.error(error);
  }
}

async function populateList(data) {
    const listContainer = document.getElementById("entity-list");
    listContainer.innerHTML = ""; // Clear previous list
  
    data.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = JSON.stringify(item); // You can format this according to your needs
      listContainer.appendChild(listItem);
  
      // Add buttons for CRUD operations (Assuming each item has an ID)
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => editEntity(item.id)); // Assuming editEntity is a function to handle editing
      listItem.appendChild(editButton);
  
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteEntity(item.id)); // Assuming deleteEntity is a function to handle deletion
      listItem.appendChild(deleteButton);
    });
  }
  

function redirectToMap() {
  window.location.href = "/html/map.html";
}
