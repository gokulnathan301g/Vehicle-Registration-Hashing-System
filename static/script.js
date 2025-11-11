// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab and activate button
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Message display function
function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = `show ${type}`;
    
    setTimeout(() => {
        messageDiv.classList.remove('show');
    }, 3000);
}

// Register vehicle form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        registration_number: document.getElementById('regNumber').value,
        owner_name: document.getElementById('ownerName').value,
        vehicle_type: document.getElementById('vehicleType').value,
        year: document.getElementById('year').value
    };
    
    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            document.getElementById('registerForm').reset();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Error registering vehicle', 'error');
    }
});

// Search vehicle form
document.getElementById('searchForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const regNumber = document.getElementById('searchRegNumber').value;
    
    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ registration_number: regNumber })
        });
        
        const result = await response.json();
        const searchResult = document.getElementById('searchResult');
        
        if (result.success) {
            const vehicle = result.vehicle;
            searchResult.innerHTML = `
                <div class="vehicle-card">
                    <h3>Vehicle Found</h3>
                    <div class="vehicle-info">
                        <div class="info-item">
                            <div class="info-label">Registration Number:</div>
                            <div>${vehicle.registration_number}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Owner Name:</div>
                            <div>${vehicle.owner_name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Vehicle Type:</div>
                            <div>${vehicle.vehicle_type}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Year:</div>
                            <div>${vehicle.year}</div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            searchResult.innerHTML = `<p style="color: #e74c3c; text-align: center;">${result.message}</p>`;
        }
    } catch (error) {
        showMessage('Error searching vehicle', 'error');
    }
});

// Delete vehicle form
document.getElementById('deleteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const regNumber = document.getElementById('deleteRegNumber').value;
    
    if (!confirm(`Are you sure you want to delete vehicle ${regNumber}?`)) {
        return;
    }
    
    try {
        const response = await fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ registration_number: regNumber })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage(result.message, 'success');
            document.getElementById('deleteForm').reset();
        } else {
            showMessage(result.message, 'error');
        }
    } catch (error) {
        showMessage('Error deleting vehicle', 'error');
    }
});

// Load all vehicles
async function loadAllVehicles() {
    try {
        const response = await fetch('/all_vehicles');
        const result = await response.json();
        const allVehiclesDiv = document.getElementById('allVehicles');
        
        if (result.vehicles.length === 0) {
            allVehiclesDiv.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No vehicles registered yet.</p>';
            return;
        }
        
        let html = '';
        result.vehicles.forEach(vehicle => {
            html += `
                <div class="vehicle-card">
                    <h3>${vehicle.registration_number}</h3>
                    <div class="vehicle-info">
                        <div class="info-item">
                            <div class="info-label">Owner:</div>
                            <div>${vehicle.owner_name}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Type:</div>
                            <div>${vehicle.vehicle_type}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Year:</div>
                            <div>${vehicle.year}</div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        allVehiclesDiv.innerHTML = html;
    } catch (error) {
        showMessage('Error loading vehicles', 'error');
    }
}

// Load all vehicles when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadAllVehicles();
});