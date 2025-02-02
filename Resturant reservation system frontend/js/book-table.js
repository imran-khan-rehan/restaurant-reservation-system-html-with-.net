const API_BASE_URL = Config.API_URL;
const bookingPopup = document.getElementById('booking-popup');
const bookingForm = document.getElementById('booking-form');
const bookedTablesBody = document.getElementById('booked-tables').querySelector('tbody');
const availableTablesDiv = document.getElementById('available-tables');
let isBookingEditing = false;
let editingBookingId = null;



async function fetchUsers() {
  try {
    const response = await fetch(API_BASE_URL + '/auth'); // Adjust the endpoint as per your API
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    alert('Failed to load users. Please try again.');
    return [];
  }
}

async function populateUserDropdown() {
  const userSelect = document.getElementById('user-select');
  const users = await fetchUsers();
  console.log("users are ",users);
  userSelect.innerHTML = '<option value="">-- Select a User --</option>';
  users.forEach(user => {
    if(user.role == "User")
    {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.email; // Adjust according to user data structure
    userSelect.appendChild(option);
    }
  });
}

async function fetchBookedTables() {
  try {
    const response = await fetch(API_BASE_URL+'/BookTables');
    if (!response.ok) throw new Error('Failed to fetch booked tables');
    return await response.json();
  } catch (error) {
    console.error('Error fetching booked tables:', error);
    alert('Failed to load booked tables. Please try again.');
    return [];
  }
}

async function displayBookedTables() {
  const bookedTables = await fetchBookedTables();
  bookedTablesBody.innerHTML = '';
  bookedTables.forEach((booking, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${booking.tableName}</td>
            <td>${new Date(booking.date).toLocaleDateString()}</td>
            <td>${booking.customerName}</td>
            <td>
                <button class="btn-edit" onclick="editBooking(${booking.id},${booking.userId})">Edit</button>
                <button class="btn-delete" onclick="deleteBooking(${booking.id})">Delete</button>
            </td>
        `;
    bookedTablesBody.appendChild(row);
  });
}

function showBookingPopup(edit = false) {
  bookingPopup.style.display = 'flex';
  populateUserDropdown(); // Load users

  if (!edit) {
    bookingForm.reset();
    availableTablesDiv.innerHTML = '';
    isBookingEditing = false;

    editingBookingId = null;
    document.getElementById('popup-title').textContent = 'Book Table';
  }
}

function closeBookingPopup() {
  bookingPopup.style.display = 'none';
}

async function showAvailableTables() {
  const selectedDate = document.getElementById('booking-date').value;
  if (!selectedDate) {
    alert('Please select a date first.');
    return;
  }

  try {
    const response = await fetch(API_BASE_URL+'/BookTables');
    const bookedTables = await response.json();
    const bookedTableNames = bookedTables
      .filter(booking => new Date(booking.date).toISOString().split('T')[0] === selectedDate)
      .map(booking => booking.tableName);

    const tablesResponse = await fetch(API_BASE_URL + '/Tables');
    const tables = await tablesResponse.json();

    const availableTables = tables.filter(
      table => !bookedTableNames.includes(table.name)
    );

    availableTablesDiv.innerHTML = availableTables.length
      ? availableTables.map(
        table => `
                    <div class="table-item">
                        <input type="radio" name="selected-table" value="${table.name}" 
                               data-table-id="${table.id}" id="table-${table.name}" required />
                        <label for="table-${table.name}">${table.name}</label>
                    </div>
                `
      ).join('')
      : '<p>No tables available for the selected date.</p>';
  } catch (error) {
    console.error('Error fetching tables:', error);
    alert('Failed to load available tables. Please try again.');
  }
}

bookingForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const selectedTable = document.querySelector('input[name="selected-table"]:checked');
  const selectedUser = document.getElementById('user-select').value;

  if (!selectedTable || !selectedUser) {
    alert('Please select a table and a user.');
    return;
  }

  const bookingData = {
    date: new Date(document.getElementById('booking-date').value).toISOString(),
    tableName: selectedTable.value,
    userId: parseInt(selectedUser),
    customerName: document.getElementById('customer-name').value,
    tableId: parseInt(selectedTable.dataset.tableId)
  };

  try {
    if (isBookingEditing) {
      const response = await fetch(`${API_BASE_URL + '/BookTables'}/${editingBookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...bookingData, id: editingBookingId })
      });
      if (!response.ok) throw new Error('Failed to update booking');
    } else {
      const response = await fetch(API_BASE_URL+'/BookTables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error('Failed to create booking');
    }

    await displayBookedTables();
    closeBookingPopup();
  } catch (error) {
    console.error('Error saving booking:', error);
    alert('Failed to save booking. Please try again.');
  }
});

async function editBooking(id,userId) {
  try {
    console.log("id="+id+"userId="+userId);
    const response = await fetch(`${API_BASE_URL+'/BookTables'}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch booking details');

    const booking = await response.json();
    isBookingEditing = true;
    editingBookingId = id;

    document.getElementById('booking-date').value = new Date(booking.date).toISOString().split('T')[0];
    document.getElementById('customer-name').value = booking.customerName;
    document.getElementById('showtable').style.display = 'none';
    await showAvailableTables2();

    setTimeout(() => {
      const tableInput = document.querySelector(`input[name="selected-table"][value="${booking.tableName}"]`);
      if (tableInput) {
        tableInput.checked = true;
      }
    }, 100);

    document.getElementById('popup-title').textContent = 'Edit Booking';
    showBookingPopup(true);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    alert('Failed to load booking details. Please try again.');
  }
}

async function showAvailableTables2() {
  try {
    const tablesResponse = await fetch(API_BASE_URL + '/Tables');
    const tables = await tablesResponse.json();

    availableTablesDiv.innerHTML = tables.length
      ? tables.map(
        table => `
                    <div class="table-item">
                        <input type="radio" name="selected-table" value="${table.name}" 
                               data-table-id="${table.id}" id="table-${table.name}" required />
                        <label for="table-${table.name}">${table.name}</label>
                    </div>
                `
      ).join('')
      : '<p>No tables available.</p>';
  } catch (error) {
    console.error('Error fetching tables:', error);
    alert('Failed to load tables. Please try again.');
  }
}

async function deleteBooking(id) {
  try {
    const response = await fetch(`${API_BASE_URL+'/BookTables'}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete booking');
    await displayBookedTables();
  } catch (error) {
    console.error('Error deleting booking:', error);
    alert('Failed to delete booking. Please try again.');
  }
}

async function init() {
  await displayBookedTables();
}

init();