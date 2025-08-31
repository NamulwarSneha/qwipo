# Qwipo Backend API

This is the backend API for the Qwipo Customer Management System, built with Node.js, Express.js, and SQLite.

## Features

- **Customer Management**: Full CRUD operations for customers
- **Address Management**: Multiple addresses per customer with CRUD operations
- **Search & Filtering**: Search by name, phone, city, state, or pin code
- **Pagination**: Built-in pagination support
- **Sorting**: Sort customers by various fields
- **Validation**: Input validation and error handling
- **Database**: SQLite database with automatic table creation

## API Endpoints

### Customers

- `POST /api/customers` - Create a new customer
- `GET /api/customers` - Get all customers (with pagination, search, filtering)
- `GET /api/customers/:id` - Get customer by ID
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Addresses

- `POST /api/customers/:id/addresses` - Add address to customer
- `GET /api/customers/:id/addresses` - Get all addresses for a customer
- `PUT /api/addresses/:addressId` - Update address
- `DELETE /api/addresses/:addressId` - Delete address

### Special Endpoints

- `GET /api/customers-with-multiple-addresses` - Get customers with multiple addresses
- `GET /api/customers-single-address` - Get customers with only one address

## Query Parameters

### GET /api/customers

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in first name, last name, or phone number
- `city` - Filter by city
- `state` - Filter by state
- `pin_code` - Filter by pin code
- `sortBy` - Sort field (default: id)
- `sortOrder` - Sort direction: ASC or DESC (default: ASC)

## Database Schema

### Customers Table
- `id` - Primary key (auto-increment)
- `first_name` - Customer's first name
- `last_name` - Customer's last name
- `phone_number` - Unique phone number
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Addresses Table
- `id` - Primary key (auto-increment)
- `customer_id` - Foreign key to customers table
- `address_details` - Street address details
- `city` - City name
- `state` - State name
- `pin_code` - Postal/ZIP code
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

- `PORT` - Server port (default: 5000)

## Development

The server automatically creates the SQLite database and tables on first run. The database file will be created as `database.db` in the backend directory.

## Error Handling

All endpoints return appropriate HTTP status codes and error messages. Common status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error