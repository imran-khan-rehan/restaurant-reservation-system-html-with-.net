const popup = document.getElementById('popup');
const restaurantForm = document.getElementById('restaurant-form');
const restaurantTableBody = document.getElementById('restaurant-table').querySelector('tbody');
// import { backendUrl } from "./config.js";
const apiUrl = Config.API_URL + '/Restaurants';

let isEditing = false;
let editingId = null;

async function fetchRestaurants() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to fetch restaurants.');
    const data = await response.json();
    displayRestaurants(data);
  } catch (error) {
    console.error(error);
    alert('Error fetching restaurants. Please try again.');
  }
}

function displayRestaurants(restaurants) {
  restaurantTableBody.innerHTML = '';
  restaurants.forEach((restaurant, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${restaurant.name}</td>
      <td>${restaurant.location}</td>
      <td>
        <button class="btn-edit" onclick="editRestaurant(${restaurant.id}, '${restaurant.name}', '${restaurant.location}')">Edit</button>
        <button class="btn-delete" onclick="deleteRestaurant(${restaurant.id})">Delete</button>
      </td>
    `;
    restaurantTableBody.appendChild(row);
  });
}

function showPopup(edit = false) {
  popup.style.display = 'flex';
  if (!edit) {
    restaurantForm.reset();
    isEditing = false;
    editingId = null;
    document.getElementById('popup-title').textContent = 'Add Restaurant';
  }
}

function closePopup() {
  popup.style.display = 'none';
}

restaurantForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const name = document.getElementById('restaurant-name').value;
  const location = document.getElementById('restaurant-location').value;

  try {
    if (isEditing) {
      await updateRestaurant(editingId, { "id":editingId,name, location });
    } else {
      await addRestaurant({ name, location });
    }
    closePopup();
    fetchRestaurants();
  } catch (error) {
    console.error(error);
    alert('Error saving restaurant. Please try again.');
  }
});

async function addRestaurant(restaurant) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurant),
    });
    if (!response.ok) throw new Error('Failed to add restaurant.');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function editRestaurant(id, name, location) {
  isEditing = true;
  editingId = id;
  document.getElementById('restaurant-name').value = name;
  document.getElementById('restaurant-location').value = location;
  document.getElementById('popup-title').textContent = 'Edit Restaurant';
  showPopup(true);
}

async function updateRestaurant(id, restaurant) {
  try {
    console.log(id);
    console.log("res",restaurant);
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurant),
    });
    if (!response.ok) throw new Error('Failed to update restaurant.');
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function deleteRestaurant(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete restaurant.');
    fetchRestaurants();
  } catch (error) {
    console.error(error);
    alert('Error deleting restaurant. Please try again.');
  }
}

// Fetch and display restaurants on page load
fetchRestaurants();
