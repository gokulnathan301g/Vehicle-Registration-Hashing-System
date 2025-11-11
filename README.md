# Vehicle Registration Hashing System

A web-based vehicle registration system using hash tables for efficient data storage and retrieval.

## Features

- **Register Vehicle**: Add new vehicle registration with owner details
- **Search Vehicle**: Find vehicle by registration number using hash table lookup
- **Delete Vehicle**: Remove vehicle registration from the system
- **View All**: Display all registered vehicles

## Data Structure Implementation

- **Hash Table**: Custom implementation with collision handling using chaining
- **Hash Function**: Uses polynomial rolling hash for registration numbers
- **Time Complexity**: O(1) average case for insert, search, and delete operations

## How to Run

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the Flask application:
   ```
   python app.py
   ```

3. Open your browser and go to: `http://localhost:5000`

## Hash Table Details

- **Size**: 100 buckets (configurable)
- **Collision Resolution**: Separate chaining using lists
- **Hash Function**: Polynomial hash with base 31
- **Load Factor**: Automatically managed

## Project Structure

```
VEHICLE REGISTRATION HASHING SYSTEM/
├── app.py              # Flask backend with hash table logic
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html     # Main web interface
└── static/
    ├── style.css      # Styling
    └── script.js      # Frontend JavaScript
```