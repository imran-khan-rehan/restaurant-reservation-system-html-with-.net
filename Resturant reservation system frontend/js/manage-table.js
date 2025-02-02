
const tablePopup = document.getElementById("table-popup");
const tableForm = document.getElementById("table-form");
const tableListBody = document.getElementById("table-list").querySelector("tbody");
const restaurantSelect = document.getElementById("table-restaurant");

const tableApiUrl = Config.API_URL + "/Tables";
const restaurantApiUrl = Config.API_URL + "/Restaurants";

let isTableEditing = false;
let editingTableId = null;

async function fetchTables() {
  try {
    const response = await fetch(tableApiUrl);
    if (!response.ok) throw new Error("Failed to fetch tables");
    const tables = await response.json();
    displayTables(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
  }
}

async function fetchRestaurants() {
  try {
    const response = await fetch(restaurantApiUrl);
    if (!response.ok) throw new Error("Failed to fetch restaurants");
    const restaurants = await response.json();
    populateRestaurants(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
  }
}

 function displayTables(tables) {
  tableListBody.innerHTML = "";
  tables.forEach((table, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${table.name}</td>
      <td>${table.price}</td>
      <td>${table.dateOfAvailability.split("T")[0]}</td>
      <td>${table.restaurantName}</td>
      <td>
        <button class="btn-edit" onclick="editTable(${table.id})">Edit</button>
        <button class="btn-delete" onclick="deleteTable(${table.id})">Delete</button>
      </td>
    `;
    tableListBody.appendChild(row);
  });
}

function populateRestaurants(restaurants) {
  restaurantSelect.innerHTML = "";
  restaurants.forEach((restaurant) => {
    const option = document.createElement("option");
    option.value = restaurant.id;
    option.textContent = restaurant.name;
    restaurantSelect.appendChild(option);
  });
}

function showTablePopup(edit = false) {
  tablePopup.style.display = "flex";
  if (!edit) {
    tableForm.reset();
    isTableEditing = false;
    editingTableId = null;
    document.getElementById("table-popup-title").textContent = "Add Table";
  }
}

function closeTablePopup() {
  tablePopup.style.display = "none";
}

async function saveTable(event) {
  event.preventDefault();
  const Name = document.getElementById("table-name").value;
  const Price = parseFloat(document.getElementById("table-price").value);
  const DateOfAvailability = document.getElementById("table-date").value;
  const RestaurantId = parseInt(document.getElementById("table-restaurant").value);

  const tableData = {"Id":editingTableId, Name, Price, DateOfAvailability, RestaurantId };

  try {
    if (isTableEditing) {
      await fetch(`${tableApiUrl}/${editingTableId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tableData),
      });
    } else {
      tableData.Id = 0;

      await fetch(tableApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tableData),
      });
    }
    fetchTables();
    closeTablePopup();
  } catch (error) {
    console.error("Error saving table:", error);
  }
}

async function editTable(id) {
  try {
    const response = await fetch(`${tableApiUrl}/${id}`);
    if (!response.ok) throw new Error("Failed to fetch table details");
    const table = await response.json();

    document.getElementById("table-name").value = table.name;
    document.getElementById("table-price").value = table.price;
    document.getElementById("table-date").value = table.dateOfAvailability.split("T")[0];
    document.getElementById("table-restaurant").value = table.restaurantId;

    isTableEditing = true;
    editingTableId = id;
    document.getElementById("table-popup-title").textContent = "Edit Table";
    showTablePopup(true);
  } catch (error) {
    console.error("Error editing table:", error);
  }
}

async function deleteTable(id) {
  try {
    await fetch(`${tableApiUrl}/${id}`, { method: "DELETE" });
    fetchTables();
  } catch (error) {
    console.error("Error deleting table:", error);
  }
}

async function init() {
  await fetchRestaurants();
  await fetchTables();
}

tableForm.addEventListener("submit", saveTable);
init();
