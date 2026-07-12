This is exactly how I would structure **Milestone 2** in an enterprise project. Since Milestone 1 (Authentication & Authorization) is complete, **Milestone 2** should focus solely on the **Fleet Management bounded context**, without introducing Driver, Trip, or Maintenance management. It should establish the Fleet domain and provide a dashboard based on fleet data only.

I have intentionally **not changed your architecture, database model, coding standards, or previous instructions**.

---

# Milestone 2 — Fleet Management

## Objective

Implement the complete Fleet Management module that enables Fleet Managers to manage the organization's vehicles and monitor fleet health through a comprehensive dashboard.

This milestone establishes the Fleet domain and provides the foundation for future modules such as Trips, Maintenance, Fuel, and Expenses.

---

## Dependencies

* ✅ Milestone 0 – Project Foundation
* ✅ Milestone 1 – Authentication & Authorization

---

# Database Tasks

Implement the Fleet module using the existing database model.

Create and migrate:

* `vehicle_type`
* `vehicle`
* `vehicle_document`

Seed Data:

### Vehicle Types

* Truck
* Van
* Bus
* Trailer
* Mini Truck

### Vehicle Status

Use the predefined status model.

No schema modifications are permitted.

Indexes:

* Registration Number (Unique)
* Vehicle Status
* Vehicle Type
* Composite (Status, Vehicle Type)

---

# Backend Tasks

## Fleet Management APIs

Implement:

```http
GET     /api/v1/vehicles
GET     /api/v1/vehicles/{id}
POST    /api/v1/vehicles
PUT     /api/v1/vehicles/{id}
DELETE  /api/v1/vehicles/{id}
```

---

## Vehicle Search APIs

```http
GET /api/v1/vehicles/search

GET /api/v1/vehicles/filter

GET /api/v1/vehicles/status/{status}

GET /api/v1/vehicles/type/{typeId}
```

---

## Vehicle Document APIs

```http
GET     /api/v1/vehicles/{id}/documents

POST    /api/v1/vehicles/{id}/documents

PUT     /api/v1/documents/{id}

DELETE  /api/v1/documents/{id}
```

---

## Fleet Dashboard APIs

Implement:

```http
GET /api/v1/fleet/dashboard

GET /api/v1/fleet/dashboard/summary

GET /api/v1/fleet/dashboard/health

GET /api/v1/fleet/dashboard/utilization

GET /api/v1/fleet/dashboard/documents

GET /api/v1/fleet/dashboard/maintenance
```

---

# Backend Components

## Entities

* VehicleEntity
* VehicleTypeEntity
* VehicleDocumentEntity

---

## Repositories

* VehicleRepository
* VehicleTypeRepository
* VehicleDocumentRepository

---

## Services

* VehicleService
* VehicleTypeService
* VehicleDocumentService
* FleetDashboardService

---

## Controllers

* VehicleController
* VehicleTypeController
* VehicleDocumentController
* FleetDashboardController

---

## DTOs

Vehicle

* VehicleRequest
* VehicleUpdateRequest
* VehicleResponse

Vehicle Type

* VehicleTypeResponse

Documents

* VehicleDocumentRequest
* VehicleDocumentResponse

Dashboard

* FleetDashboardResponse
* FleetHealthResponse
* FleetSummaryResponse

Search

* VehicleSearchRequest
* VehicleFilterRequest

---

## Validators

Create custom validators.

* RegistrationNumberValidator
* VehicleCapacityValidator
* VehicleStatusValidator
* VehicleDocumentValidator

---

## Exception Handling

* DuplicateRegistrationException
* VehicleNotFoundException
* InvalidVehicleStatusException
* VehicleDocumentExpiredException
* VehicleAlreadyRetiredException

---

# Business Rules

## Vehicle Registration

* Registration number must be unique.
* Vehicle type is mandatory.
* Capacity must be greater than zero.
* Acquisition cost must be positive.
* Odometer cannot be negative.

---

## Vehicle Status

Only predefined statuses are allowed.

* AVAILABLE
* RESERVED
* ON_TRIP
* IN_SHOP
* BREAKDOWN
* RETIRED

Do not introduce additional statuses.

---

## Vehicle Documents

* Insurance expiry is mandatory.
* Registration expiry is mandatory.
* Pollution certificate expiry is mandatory.
* Permit expiry is mandatory where applicable.

Expired documents must be flagged.

---

## Fleet Rules

* Retired vehicles cannot be modified except by Administrators.
* Deleted vehicles must use soft delete.
* Registration numbers are immutable after creation.
* Vehicle type cannot be null.

---

# Fleet Dashboard

The dashboard SHALL expose the following KPIs.

## Fleet Overview

* Total Fleet
* Active Vehicles
* Available Vehicles
* Reserved Vehicles
* Vehicles On Trip
* Vehicles In Maintenance
* Breakdown Vehicles
* Retired Vehicles

---

## Fleet Health

Calculate

Fleet Health Score

Example calculation (implementation may evolve):

```
Health Score =
100

− Vehicles in Breakdown

− Overdue Maintenance

− Expired Documents
```

The calculation should be encapsulated within the service layer to allow future refinement without affecting the API.

---

## Fleet Utilization

Calculate

```
On Trip Vehicles

/

Active Vehicles

×

100
```

Return as percentage.

---

## Fleet Alerts

Dashboard must expose

* Documents Expiring
* Maintenance Due

Return

* Count
* Vehicle List

---

# Frontend Tasks

## Fleet Dashboard

Create dashboard page.

Widgets

* Total Fleet
* Active Vehicles
* Available Vehicles
* Reserved Vehicles
* On Trip
* Maintenance
* Breakdown
* Retired
* Fleet Health Score
* Fleet Utilization
* Documents Expiring
* Maintenance Due

---

## Vehicle Management

Create

* Vehicle List
* Vehicle Details
* Vehicle Form
* Edit Vehicle
* Delete Vehicle
* View Documents

---

## Vehicle Search

Support

* Search
* Filter
* Sort
* Pagination
* Status Filter
* Type Filter

---

## Vehicle Documents

Create

* Upload Document
* Replace Document
* View Documents
* Document Expiry Indicators

---

## Fleet Dashboard Components

Create

* FleetSummaryCard
* FleetHealthCard
* FleetUtilizationCard
* FleetStatusChart
* FleetAlertsCard
* FleetOverviewGrid

---

## Vehicle Components

Create

* VehicleTable
* VehicleForm
* VehicleCard
* VehicleStatusChip
* VehicleDocumentTable
* VehicleFilterPanel

---

# Permissions Matrix

| Role           | Fleet Dashboard | Vehicles | Vehicle Types | Documents |
| -------------- | --------------- | -------- | ------------- | --------- |
| Admin          | Full            | CRUD     | CRUD          | CRUD      |
| Fleet Manager  | Full            | CRUD     | Read          | CRUD      |
| Dispatcher     | Read            | Read     | Read          | Read      |
| Driver         | None            | None     | None          | None      |
| Finance        | Read            | Read     | Read          | Read      |
| Safety Officer | Read            | Read     | Read          | Read      |

---

# Testing

## Backend

* Vehicle CRUD tests
* Registration uniqueness tests
* Vehicle validation tests
* Fleet dashboard calculation tests
* Vehicle search tests
* Vehicle document tests
* Authorization tests

---

## Frontend

* Vehicle form validation
* Vehicle CRUD flow
* Dashboard rendering
* Search and filter
* Pagination
* Document upload
* Fleet dashboard widgets

---

# Deliverables

## Backend

* Vehicle Management APIs completed
* Vehicle Type APIs completed
* Vehicle Document APIs completed
* Fleet Dashboard APIs completed
* Swagger documentation updated

---

## Frontend

* Fleet Dashboard completed
* Vehicle Management completed
* Vehicle Search completed
* Vehicle Document Management completed
* Dashboard integrated with backend APIs

---

## Database

* Vehicle tables migrated
* Vehicle type seed data inserted
* Indexes created
* Constraints verified

---

# Definition of Done

The milestone is complete when:

* Fleet Managers can perform full vehicle CRUD operations.
* Vehicle registration numbers are unique and immutable.
* Vehicle search, filtering, sorting, and pagination work correctly.
* Vehicle documents can be managed and expiry dates tracked.
* Fleet Dashboard displays all required KPIs:

  * Total Fleet
  * Active Vehicles
  * Available Vehicles
  * Reserved Vehicles
  * On Trip
  * Maintenance
  * Breakdown
  * Retired
  * Fleet Health Score
  * Fleet Utilization
  * Documents Expiring
  * Maintenance Due
* Role-based access is enforced.
* Unit and integration tests pass.
* Swagger documentation is complete.
* Database migrations execute successfully.

---

# Acceptance Criteria

* Fleet Management is fully operational.
* Fleet Dashboard displays accurate real-time metrics.
* Vehicle CRUD operations comply with all business rules.
* Dashboard APIs are optimized for fast retrieval.
* Vehicle document management is functional.
* Security and RBAC remain enforced.
* No changes have been made to the approved database schema or architecture.
* The application is ready for **Milestone 3 – Driver Management**.
