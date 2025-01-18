# Aqua-Estimaits Backend

Backend server for the Aqua-Estimaits planning system, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- Facility Planning Management
- Production Planning Management
- Sales Planning Management
- Financial Planning Management
- RESTful API Design
- TypeScript Support
- MongoDB Integration
- Error Handling
- Request Validation
- CORS Support
- API Documentation

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd Aqua-Estimaits/backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/aqua-estimaits
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

## Development

Start the development server:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Facility Planning

- `GET /api/facility` - Get all facilities
- `GET /api/facility/:id` - Get facility by ID
- `POST /api/facility` - Create new facility
- `PUT /api/facility/:id` - Update facility
- `DELETE /api/facility/:id` - Delete facility

### Production Planning

- `GET /api/production` - Get all production plans
- `GET /api/production/:id` - Get production plan by ID
- `GET /api/production/facility/:facilityId` - Get production plans by facility
- `POST /api/production` - Create new production plan
- `PUT /api/production/:id` - Update production plan
- `PATCH /api/production/:id/status` - Update production status
- `DELETE /api/production/:id` - Delete production plan

### Sales Planning

- `GET /api/sales` - Get all sales plans
- `GET /api/sales/:id` - Get sales plan by ID
- `GET /api/sales/product/:productId` - Get sales plans by product
- `GET /api/sales/analytics` - Get sales analytics
- `POST /api/sales` - Create new sales plan
- `PUT /api/sales/:id` - Update sales plan
- `PATCH /api/sales/:id/status` - Update sales status
- `DELETE /api/sales/:id` - Delete sales plan

### Financial Planning

- `GET /api/financial` - Get all financial plans
- `GET /api/financial/:id` - Get financial plan by ID
- `GET /api/financial/date-range` - Get financial plans by date range
- `GET /api/financial/summary` - Get financial summary
- `POST /api/financial` - Create new financial plan
- `PUT /api/financial/:id` - Update financial plan
- `DELETE /api/financial/:id` - Delete financial plan

## Project Structure

```
src/
├── api/
│   ├── controllers/    # Request handlers
│   └── routes/         # API routes
├── middleware/         # Custom middleware
├── models/            # Database models
├── utils/             # Utility functions
└── index.ts           # Application entry point
```

## Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "errors": ["Validation error details"],
    "stack": "Stack trace (development only)"
  }
}
```

## Validation

Request validation is implemented using express-validator. Validation rules are defined for each endpoint to ensure data integrity.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC
