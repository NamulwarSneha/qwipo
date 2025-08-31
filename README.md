# Qwipo Customer Management System

A full-stack web application for managing customer and address information, built with React.js, Node.js, Express.js, and SQLite.

## 🚀 Features

### Customer Management
- **Create**: Add new customers with validation
- **Read**: View customer list with search, filtering, and pagination
- **Update**: Edit customer information
- **Delete**: Remove customer records with confirmation

### Address Management
- **Multiple Addresses**: Support for multiple addresses per customer
- **CRUD Operations**: Full address management capabilities
- **Location Filtering**: Search by city, state, or pin code

### Advanced Features
- **Search & Filtering**: Search customers by name, phone, or location
- **Pagination**: Navigate through large datasets
- **Sorting**: Sort data by various fields
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Comprehensive error management and logging

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite** - Lightweight database
- **CORS** - Cross-origin resource sharing

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Styling and responsive design

## 📁 Project Structure

```
Qwipo/
├── backend/                 # Node.js/Express backend
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── README.md           # Backend documentation
├── frontend/               # React.js frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   └── App.js         # Main application component
│   ├── package.json       # Frontend dependencies
│   └── README.md          # Frontend documentation
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Customer Endpoints
- `POST /customers` - Create customer
- `GET /customers` - List customers (with pagination, search, filtering)
- `GET /customers/:id` - Get customer by ID
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Address Endpoints
- `POST /customers/:id/addresses` - Add address to customer
- `GET /customers/:id/addresses` - Get customer addresses
- `PUT /addresses/:addressId` - Update address
- `DELETE /addresses/:addressId` - Delete address

### Special Endpoints
- `GET /customers-with-multiple-addresses` - Customers with multiple addresses
- `GET /customers-single-address` - Customers with single address

## 🎯 Assignment Requirements Met

### Mobile CRUD Operations ✅
- [x] Create New Customer with validation
- [x] Read Existing Customer Details
- [x] Update Customer Information
- [x] Delete Customer Record
- [x] View Multiple Addresses
- [x] Save Updated Multiple Address
- [x] Mark Customer as Having Only One Address
- [x] Search by City, State, or Pincode
- [x] Clear Filters
- [x] Page Navigation

### Web CRUD Operations ✅
- [x] Create New Customer with form validation
- [x] Read Existing Customer Data
- [x] Update Customer Information
- [x] Delete Customer Record
- [x] View Available Multiple Addresses
- [x] Save Updated Multiple Address
- [x] Mark Customer as Having Only One Address
- [x] Search by City, State, or PIN
- [x] Clear Filters
- [x] Page Navigation
- [x] Responsive Design

### Additional Features ✅
- [x] Error Handling & Logging System
- [x] Input Validation (Client & Server-side)
- [x] Database Management
- [x] API Documentation

## 🔧 Development

### Database
The SQLite database is automatically created when the backend starts. Tables are created with proper relationships and constraints.

### Adding New Features
1. Backend: Add new routes in `backend/index.js`
2. Frontend: Create new components in `frontend/src/components/`
3. Update routing in `frontend/src/App.js`

### Testing
- Backend: Test API endpoints using tools like Postman
- Frontend: Test UI components manually
- Database: Verify data integrity and relationships

## 📱 Responsive Design

The application is designed to work seamlessly across all device sizes:
- **Desktop**: Full-featured interface with advanced controls
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with simplified navigation

## 🚨 Error Handling

- **Client-side**: Form validation and user feedback
- **Server-side**: Input validation and database error handling
- **API**: Proper HTTP status codes and error messages
- **Logging**: Comprehensive error logging for debugging

## 📝 License

This project is created for the Qwipo assignment demonstration.


**Note**: This is a demonstration project showcasing full-stack development skills with React.js, Node.js, Express.js, and SQLite. All CRUD operations, search functionality, and responsive design requirements have been implemented according to the assignment specifications.