from flask import Flask, render_template, request, jsonify
import os
import json

app = Flask(__name__)

class VehicleHashTable:
    def __init__(self, size=100):
        self.size = size
        self.table = [[] for _ in range(size)]
        self.count = 0
        self.data_file = 'vehicles.json'
        self.load_data()
    
    def hash_function(self, registration_number):
        """Hash function using registration number"""
        hash_value = 0
        for char in registration_number:
            hash_value = (hash_value * 31 + ord(char)) % self.size
        return hash_value
    
    def save_data(self):
        """Save data to JSON file"""
        vehicles = []
        for bucket in self.table:
            for reg_num, owner_name, vehicle_type, year in bucket:
                vehicles.append({
                    'registration_number': reg_num,
                    'owner_name': owner_name,
                    'vehicle_type': vehicle_type,
                    'year': year
                })
        
        try:
            with open(self.data_file, 'w') as f:
                json.dump(vehicles, f, indent=2)
        except:
            pass  # Ignore file write errors in production
    
    def load_data(self):
        """Load data from JSON file"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r') as f:
                    vehicles = json.load(f)
                    for vehicle in vehicles:
                        self.insert_without_save(
                            vehicle['registration_number'],
                            vehicle['owner_name'],
                            vehicle['vehicle_type'],
                            vehicle['year']
                        )
        except:
            pass  # Ignore file read errors
    
    def insert_without_save(self, registration_number, owner_name, vehicle_type, year):
        """Insert without saving to file (used during loading)"""
        index = self.hash_function(registration_number)
        
        # Check if registration already exists
        for i, (reg_num, _, _, _) in enumerate(self.table[index]):
            if reg_num == registration_number:
                self.table[index][i] = (registration_number, owner_name, vehicle_type, year)
                return True
        
        # Add new entry
        self.table[index].append((registration_number, owner_name, vehicle_type, year))
        self.count += 1
        return True
    
    def insert(self, registration_number, owner_name, vehicle_type, year):
        """Insert vehicle data into hash table"""
        result = self.insert_without_save(registration_number, owner_name, vehicle_type, year)
        self.save_data()
        return result
    
    def search(self, registration_number):
        """Search for vehicle by registration number"""
        index = self.hash_function(registration_number)
        
        for reg_num, owner_name, vehicle_type, year in self.table[index]:
            if reg_num == registration_number:
                return {
                    'registration_number': reg_num,
                    'owner_name': owner_name,
                    'vehicle_type': vehicle_type,
                    'year': year
                }
        return None
    
    def delete(self, registration_number):
        """Delete vehicle from hash table"""
        index = self.hash_function(registration_number)
        
        for i, (reg_num, _, _, _) in enumerate(self.table[index]):
            if reg_num == registration_number:
                del self.table[index][i]
                self.count -= 1
                self.save_data()
                return True
        return False
    
    def get_all_vehicles(self):
        """Get all registered vehicles"""
        vehicles = []
        for bucket in self.table:
            for reg_num, owner_name, vehicle_type, year in bucket:
                vehicles.append({
                    'registration_number': reg_num,
                    'owner_name': owner_name,
                    'vehicle_type': vehicle_type,
                    'year': year
                })
        return vehicles

# Initialize hash table
vehicle_db = VehicleHashTable()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['POST'])
def register_vehicle():
    data = request.json
    reg_num = data.get('registration_number', '').upper()
    owner_name = data.get('owner_name', '')
    vehicle_type = data.get('vehicle_type', '')
    year = data.get('year', '')
    
    if not all([reg_num, owner_name, vehicle_type, year]):
        return jsonify({'success': False, 'message': 'All fields are required'})
    
    vehicle_db.insert(reg_num, owner_name, vehicle_type, year)
    return jsonify({'success': True, 'message': 'Vehicle registered successfully'})

@app.route('/search', methods=['POST'])
def search_vehicle():
    data = request.json
    reg_num = data.get('registration_number', '').upper()
    
    if not reg_num:
        return jsonify({'success': False, 'message': 'Registration number is required'})
    
    vehicle = vehicle_db.search(reg_num)
    if vehicle:
        return jsonify({'success': True, 'vehicle': vehicle})
    else:
        return jsonify({'success': False, 'message': 'Vehicle not found'})

@app.route('/delete', methods=['POST'])
def delete_vehicle():
    data = request.json
    reg_num = data.get('registration_number', '').upper()
    
    if not reg_num:
        return jsonify({'success': False, 'message': 'Registration number is required'})
    
    if vehicle_db.delete(reg_num):
        return jsonify({'success': True, 'message': 'Vehicle deleted successfully'})
    else:
        return jsonify({'success': False, 'message': 'Vehicle not found'})

@app.route('/all_vehicles', methods=['GET'])
def get_all_vehicles():
    vehicles = vehicle_db.get_all_vehicles()
    return jsonify({'vehicles': vehicles})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)