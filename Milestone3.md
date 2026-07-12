# M03_DRIVER.md

# Milestone 3 – Driver & Safety Management

**Version:** 1.0

**Project:** TransitOps

**Milestone Type:** Functional Module

**Dependencies**

- ✅ Milestone 0 – Project Foundation
- ✅ Milestone 1 – Authentication & Authorization
- ✅ Milestone 2 – Fleet Management

---

# 1. Objective

Implement the complete Driver & Safety Management domain.

This milestone establishes the personnel domain of TransitOps and introduces:

- Driver Management
- Driver Dashboard
- Trip Operations
- Digital Vehicle Inspection
- Driver Navigation
- Emergency Reporting
- Driver Fuel & Expenses
- Driver Documents
- Driver Performance
- Offline Support
- Driver Notifications
- Safety Officer Module
- Compliance
- Incident Management
- Safety Analytics
- Driver Training

This milestone shall provide every feature required for managing drivers while remaining fully compatible with previous milestones.

---

# 2. Scope

## Included

### Driver

- Driver CRUD
- Driver Dashboard
- Driver Trips
- Vehicle Inspection
- Driver Documents
- Performance Dashboard
- Fuel Logs
- Expenses
- Notifications

---

### Safety Officer

- Driver Verification
- Compliance Dashboard
- Incident Management
- Safety Reports
- Analytics
- Training

---

## Excluded

The following are intentionally excluded.

- GPS Tracking
- Live Telematics
- AI Route Optimization
- IoT Sensor Integration
- Payroll
- HR
- Vehicle Finance

Future milestones will implement them.

---

# 3. Module Overview

```
Driver Module

│

├── Driver Management

├── Driver Dashboard

├── Trip Operations

├── Digital Inspection

├── Navigation

├── Emergency Reporting

├── Fuel & Expenses

├── Documents

├── Performance

├── Notifications

└── Offline Mode

-----------------------------------------

Safety Module

│

├── Driver Verification

├── Compliance

├── Incident Management

├── Reports

├── Analytics

└── Training
```

---

# 4. Database Impact

Reuse existing database.

Use existing entities.

- driver
- trip
- fuel_log
- expense
- maintenance_log
- vehicle
- vehicle_document

New entities may only be introduced when required for new functionality.

Examples

- inspection
- incident
- training
- driver_notification

Database normalization must remain at 3NF.

No breaking schema changes.

---

# 5. Functional Modules

## Module 1

Driver Management

Purpose

Manage driver profiles.

Features

- CRUD
- Search
- Filtering
- Status
- License Tracking
- Driver Availability

---

## Module 2

Driver Dashboard

Purpose

Provide drivers with operational visibility.

Dashboard Widgets

- Current Trip
- Upcoming Trips
- Trip Timeline
- Assigned Vehicle
- ETA
- Daily Summary

---

## Module 3

Trip Operations

Purpose

Allow drivers to execute assigned trips.

Functions

- View Assigned Trips
- Accept Trip
- Start Trip
- Complete Trip
- Cancel Trip
- Trip History

---

## Module 4

Digital Inspection

Purpose

Perform pre-trip inspections.

Checklist

- Tires
- Brakes
- Fuel
- Lights
- Mirrors
- Documents
- Cargo
- Vehicle Cleanliness

Inspection Result

- Pass
- Report Issue
- Upload Photos

---

## Module 5

Navigation

Purpose

Assist drivers.

Functions

- Route
- Pickup
- Destination
- ETA
- Traffic
- Alternate Route
- Toll Information

---

## Module 6

Emergency Reporting

Purpose

Allow emergency reporting.

Events

- Accident
- Breakdown
- Medical Emergency
- Cargo Damage
- Road Block
- Security Threat

Support

- GPS
- Photos
- Video
- Voice Notes
- SOS

---

## Module 7

Fuel & Expenses

Functions

Fuel

- Quantity
- Cost
- Odometer
- Fuel Station

Expenses

- Toll
- Parking
- Miscellaneous

Attachments

Receipt Upload

---

## Module 8

Driver Documents

Support

- License
- Insurance
- Registration
- Permit
- Pollution Certificate

Track

Expiry

Verification

Renewal

---

## Module 9

Performance Dashboard

Metrics

- Safety Score
- Distance Driven
- Trips Completed
- Fuel Efficiency
- Rewards
- Badges
- Monthly Earnings

---

## Module 10

Offline Support

Support

- Offline Trips
- Offline Inspection
- Offline Fuel Logs
- Offline Incident Reports

Automatic synchronization once online.

---

## Module 11

Notifications

Support

- Trip Assigned
- Dispatcher Message
- Fuel Reminder
- Maintenance Reminder
- License Expiry
- Document Expiry

---

## Module 12

Safety Officer

Functions

Driver CRUD

Verification

Compliance

Training

Analytics

Reports

Incidents

---

# 6. Business Rules

Driver

- License Number unique.
- Driver must be ACTIVE before accepting trips.
- Suspended drivers cannot receive trips.
- Driver may only have one active trip.
- Expired license blocks dispatch.

Trip

- Driver may accept assigned trip only.
- Driver cannot start cancelled trip.
- Driver cannot complete draft trip.
- Driver cannot cancel completed trip.

Inspection

- Every trip requires completed inspection.
- Failed inspection blocks trip start.

Fuel

- Fuel quantity positive.
- Fuel cost positive.

Expenses

- Amount positive.

Emergency

- Emergency reports immutable after submission.

Documents

- Expired documents invalidate driver eligibility.

---

# 7. User Roles

Driver

- View own profile
- Manage inspections
- View trips
- Record fuel
- Record expenses
- Report emergencies

Safety Officer

- Manage drivers
- Verify licenses
- Investigate incidents
- Suspend drivers
- Review analytics
- Generate reports

Administrator

Full access.

---

# 8. Backend Deliverables

Implement

Controllers

- DriverController
- DriverDashboardController
- TripController
- InspectionController
- EmergencyController
- FuelController
- ExpenseController
- NotificationController
- SafetyController
- TrainingController

Services

Repositories

DTOs

Validators

Mappers

OpenAPI Documentation

Unit Tests

Integration Tests

---

# 9. Frontend Deliverables

Pages

Driver Dashboard

Trips

Inspection

Fuel

Expenses

Documents

Notifications

Safety Dashboard

Training

Incident Management

Components

Reusable

Responsive

Material UI

React Query

Zustand

React Hook Form

Zod

---

# 10. Epics

This milestone is divided into independent implementation epics.

| Epic | Description |
|--------|------------|
| E01 | Driver Management |
| E02 | Driver Dashboard |
| E03 | Trip Operations |
| E04 | Digital Vehicle Inspection |
| E05 | Navigation |
| E06 | Emergency Reporting |
| E07 | Fuel & Expenses |
| E08 | Driver Documents |
| E09 | Driver Performance |
| E10 | Offline Mode |
| E11 | Notifications |
| E12 | Safety Officer |
| E13 | Compliance |
| E14 | Incident Management |
| E15 | Safety Analytics |
| E16 | Training |

Each epic shall be implemented independently.

---

# 11. Implementation Order

The AI SHALL implement epics sequentially.

```
Driver Management

↓

Driver Dashboard

↓

Trip Operations

↓

Inspection

↓

Navigation

↓

Emergency

↓

Fuel

↓

Documents

↓

Performance

↓

Offline

↓

Notifications

↓

Safety

↓

Compliance

↓

Incident

↓

Analytics

↓

Training
```

Future epics shall never be implemented early.

---

# 12. Testing Requirements

Backend

- Unit Tests
- Integration Tests
- Security Tests
- Repository Tests
- Controller Tests

Frontend

- Component Tests
- Page Tests
- Route Tests
- Permission Tests

Minimum Coverage

80%

---

# 13. Deliverables

Backend

- REST APIs
- Swagger
- Services
- DTOs
- Validation
- Tests

Frontend

- Pages
- Components
- API Integration
- Responsive Layout

Database

- Required migrations
- Seed data
- Constraints
- Indexes

Documentation

- API documentation
- Updated project documentation

---

# 14. Definition of Done

The milestone is complete when:

- Driver CRUD is fully operational.
- Driver Dashboard is functional.
- Trip Operations work correctly.
- Digital Inspection is complete.
- Fuel & Expense tracking is operational.
- Driver Documents are managed.
- Performance Dashboard is available.
- Notifications are functioning.
- Safety Officer module is implemented.
- Compliance tracking works.
- Incident Management is functional.
- Safety Analytics are available.
- Training module is operational.
- RBAC is enforced.
- Unit and integration tests pass.
- Swagger documentation is complete.
- Database migrations execute successfully.
- Frontend and backend compile successfully.

---

# 15. Acceptance Criteria

This milestone is accepted only if:

- All sixteen epics are completed.
- Business rules are enforced.
- Security is preserved.
- Database integrity is maintained.
- No breaking changes are introduced.
- REST APIs conform to project standards.
- Frontend follows established architecture.
- Backend follows Clean Architecture.
- Code coverage meets project standards.
- The project is ready to begin Milestone 4.