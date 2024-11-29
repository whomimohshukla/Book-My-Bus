# BookMyBus - Bus Ticket Booking System Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Data Models](#data-models)
3. [API Documentation](#api-documentation)
4. [Admin Dashboard](#admin-dashboard)
5. [Passenger Features](#passenger-features)
6. [Implementation Guidelines](#implementation-guidelines)

## 1. System Overview

BookMyBus is a comprehensive bus ticket booking platform that enables users to search, book, and manage bus tickets while providing administrators with tools to manage buses, routes, and bookings.

### Key Features
- User registration and authentication
- Advanced bus search and booking
- Seat selection and layout visualization
- Payment processing
- Real-time tracking
- Loyalty program
- Travel insurance
- Emergency assistance

## 2. Data Models

### User Model
```javascript
{
  userId: ObjectId,
  name: String,
  email: String,
  phone: String,
  password: String (hashed),
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  bookingHistory: [BookingId],
  createdAt: Date,
  updatedAt: Date
}
```

### Bus Model
```javascript
{
  busId: ObjectId,
  busNumber: String,
  busName: String,
  operatorId: ObjectId,
  type: String (AC/Non-AC/Sleeper/Semi-Sleeper),
  totalSeats: Number,
  amenities: [{
    name: String,
    icon: String,
    description: String
  }],
  seatLayout: {
    rows: Number,
    columns: Number,
    seats: [{
      seatNumber: String,
      type: String (Window/Aisle/Sleeper),
      deck: String (Lower/Upper),
      isAvailable: Boolean,
      price: Number
    }]
  }
}
```

### Route Model
```javascript
{
  routeId: ObjectId,
  source: {
    cityId: ObjectId,
    name: String,
    state: String,
    location: {
      type: "Point",
      coordinates: [longitude, latitude]
    }
  },
  destination: {
    cityId: ObjectId,
    name: String,
    state: String,
    location: {
      type: "Point",
      coordinates: [longitude, latitude]
    }
  },
  distance: Number,
  estimatedDuration: Number,
  viaStops: [{
    cityId: ObjectId,
    name: String,
    arrivalTime: Time,
    departureTime: Time,
    stopDuration: Number
  }]
}
```

### Schedule Model
```javascript
{
  scheduleId: ObjectId,
  busId: ObjectId,
  routeId: ObjectId,
  departureTime: DateTime,
  arrivalTime: DateTime,
  availableSeats: Number,
  fareDetails: {
    baseFare: Number,
    tax: Number,
    serviceFee: Number
  },
  status: String (Active/Cancelled/Completed),
  driverDetails: {
    name: String,
    phone: String,
    license: String
  }
}
```

### Booking Model
```javascript
{
  bookingId: ObjectId,
  userId: ObjectId,
  scheduleId: ObjectId,
  bookingDate: DateTime,
  journeyDate: Date,
  status: String (Confirmed/Cancelled/Pending),
  totalAmount: Number,
  paymentStatus: String,
  paymentId: ObjectId,
  passengers: [{
    name: String,
    age: Number,
    gender: String,
    seatNumber: String
  }],
  contactDetails: {
    phone: String,
    email: String
  },
  cancellation: {
    cancelledAt: DateTime,
    reason: String,
    refundAmount: Number,
    refundStatus: String
  }
}
```

### Payment Model
```javascript
{
  paymentId: ObjectId,
  bookingId: ObjectId,
  userId: ObjectId,
  amount: Number,
  paymentMethod: String,
  transactionId: String,
  status: String (Success/Failed/Pending),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### Enhanced Passenger Profile Model
```javascript
{
  passengerId: ObjectId,
  userId: ObjectId,
  preferences: {
    seatPreference: String,
    mealPreference: String,
    specialAssistance: Boolean,
    notificationPreferences: {
      sms: Boolean,
      email: Boolean,
      push: Boolean
    },
    frequentRoutes: [{
      source: String,
      destination: String,
      frequency: Number
    }]
  },
  savedTravelers: [{
    name: String,
    age: Number,
    gender: String,
    idType: String,
    idNumber: String,
    relationship: String
  }],
  loyaltyProgram: {
    points: Number,
    tier: String,
    joinDate: Date,
    history: [{
      action: String,
      points: Number,
      date: Date
    }]
  }
}
```

### Journey Tracking Model
```javascript
{
  journeyId: ObjectId,
  bookingId: ObjectId,
  status: String,
  currentLocation: {
    coordinates: [Number],
    lastUpdated: DateTime
  },
  estimatedArrival: DateTime,
  delays: [{
    reason: String,
    duration: Number,
    updatedETA: DateTime
  }],
  stops: [{
    location: String,
    arrivalTime: DateTime,
    departureTime: DateTime,
    status: String
  }]
}
```

### Travel Insurance Model
```javascript
{
  policyId: ObjectId,
  bookingId: ObjectId,
  passengerId: ObjectId,
  coverage: {
    type: String,
    amount: Number,
    startDate: Date,
    endDate: Date
  },
  claims: [{
    claimId: ObjectId,
    reason: String,
    amount: Number,
    status: String,
    documents: [String]
  }]
}
```

## 3. API Documentation

### Authentication APIs

#### Public Endpoints
```javascript
POST /api/auth/register
- Register new user
Request: {
  name: String,
  email: String,
  phone: String,
  password: String
}

POST /api/auth/login
- User login
Request: {
  email: String,
  password: String
}

POST /api/auth/forgot-password
POST /api/auth/reset-password
```

#### Admin Endpoints
```javascript
POST /api/admin/auth/login
POST /api/admin/auth/logout
```

### Bus Management APIs

#### Admin Endpoints
```javascript
GET /api/admin/buses
- List all buses
- Supports pagination and filtering

POST /api/admin/buses
- Create new bus
Request: {
  busNumber: String,
  busName: String,
  type: String,
  totalSeats: Number,
  amenities: Array,
  seatLayout: Object
}

PUT /api/admin/buses/:id
DELETE /api/admin/buses/:id
POST /api/admin/buses/:id/seats
```

#### Public Endpoints
```javascript
GET /api/buses/search
- Search buses
Query params: {
  source: String,
  destination: String,
  date: Date,
  type: String,
  seats: Number
}

GET /api/buses/:id/availability
- Check seat availability
```

### Route Management APIs

#### Admin Endpoints
```javascript
GET /api/admin/routes
POST /api/admin/routes
PUT /api/admin/routes/:id
DELETE /api/admin/routes/:id
POST /api/admin/routes/:id/stops
```

#### Public Endpoints
```javascript
GET /api/routes/search
GET /api/routes/popular
GET /api/routes/:id/schedules
```

### Booking Management APIs

#### User Endpoints
```javascript
POST /api/bookings
- Create new booking
Request: {
  scheduleId: ObjectId,
  seats: Array,
  passengers: Array,
  contactDetails: Object
}

GET /api/bookings/user/:userId
GET /api/bookings/:id
PUT /api/bookings/:id/cancel
```

#### Admin Endpoints
```javascript
GET /api/admin/bookings
PUT /api/admin/bookings/:id/status
GET /api/admin/bookings/reports
```

### Payment APIs
```javascript
POST /api/payments/initiate
POST /api/payments/verify
POST /api/payments/refund
```

### Enhanced Passenger APIs

#### Profile Management
```javascript
GET    /api/passengers/profile
PUT    /api/passengers/profile
GET    /api/passengers/saved-travelers
POST   /api/passengers/saved-travelers
DELETE /api/passengers/saved-travelers/:id

// Travel Preferences
POST   /api/passengers/preferences
GET    /api/passengers/preferences
PUT    /api/passengers/preferences/:id
```

#### Smart Booking
```javascript
// Seat Recommendations
GET    /api/bookings/recommendations
Query params: {
  travelHistory: Boolean,
  preferences: Boolean,
  groupSize: Number
}

// Group Booking
POST   /api/bookings/group
Request: {
  scheduleId: ObjectId,
  groupSize: Number,
  seatingPreference: String,
  passengers: Array
}

// Flexible Date Booking
GET    /api/bookings/flexible-dates
Query params: {
  source: String,
  destination: String,
  dateRange: {
    start: Date,
    end: Date
  }
}
```

#### Travel Companion Features
```javascript
// Journey Tracking
GET    /api/journeys/active
GET    /api/journeys/:id/track
GET    /api/journeys/:id/eta

// Live Updates
GET    /api/journeys/:id/updates
GET    /api/journeys/:id/alerts

// Co-passenger Chat
POST   /api/journeys/:id/chat
GET    /api/journeys/:id/chat/messages
```

#### Loyalty Program
```javascript
// Points Management
GET    /api/loyalty/points
GET    /api/loyalty/history
POST   /api/loyalty/redeem

// Rewards
GET    /api/loyalty/rewards
POST   /api/loyalty/rewards/claim/:id
GET    /api/loyalty/tier-status
```

#### Enhanced Services
```javascript
// Meal Preferences
GET    /api/bookings/:id/meals
POST   /api/bookings/:id/meals
PUT    /api/bookings/:id/meals/:mealId

// Extra Services
GET    /api/services/available
POST   /api/bookings/:id/services
```

#### Travel Insurance
```javascript
GET    /api/insurance/plans
POST   /api/insurance/purchase
GET    /api/insurance/policy/:id
POST   /api/insurance/claims
GET    /api/insurance/claims/:id
```

#### Emergency Services
```javascript
POST   /api/emergency/sos
GET    /api/emergency/contacts
PUT    /api/emergency/contacts
GET    /api/emergency/nearby-hospitals
```

## 4. Admin Dashboard

### Components Structure

#### Layout Components
- AdminLayout
- Sidebar
- Header
- Footer

#### Authentication Views
- AdminLogin
- ForgotPassword
- ResetPassword

#### Dashboard Views
- DashboardHome
  - RevenueStats
  - BookingStats
  - ActiveTrips
  - RecentBookings

#### Management Views
- Bus Management
  - BusList
  - BusForm
  - BusDetails
- Route Management
  - RouteList
  - RouteForm
  - RouteDetails
- Booking Management
  - BookingList
  - BookingDetails
- User Management
  - UserList
  - UserDetails

#### Reports & Analytics
- RevenueReports
- BookingReports
- RouteAnalytics
- CustomerAnalytics

### Security Features
- Role-based Access Control (RBAC)
- Activity Logging
- Audit Trail
- Session Management
- IP Whitelisting
- 2FA Authentication

## 5. Implementation Guidelines

### Security Considerations
1. Use JWT for authentication
2. Implement rate limiting
3. Input validation
4. XSS protection
5. CSRF protection
6. Data encryption

### Performance Optimization
1. Implement caching
2. Database indexing
3. Lazy loading
4. Image optimization
5. Code splitting

### Monitoring
1. Error tracking
2. Performance monitoring
3. User activity logging
4. System health checks

### Development Best Practices
1. Follow REST API standards
2. Use TypeScript for type safety
3. Implement proper error handling
4. Write unit and integration tests
5. Use proper versioning
6. Document code and APIs

### Deployment Considerations
1. Use environment variables
2. Set up CI/CD pipeline
3. Implement backup strategy
4. Monitor server resources
5. Use SSL/TLS
6. Set up logging and monitoring

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run database migrations
5. Start development server

```bash
git clone <repository-url>
cd bookmybus
npm install
cp .env.example .env
npm run migrate
npm run dev
```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
