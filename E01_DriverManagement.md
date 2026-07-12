# E01_DriverManagement.md

# Epic 01 – Driver Management

**Epic ID:** M03-E01

**Milestone:** M03 – Driver & Safety Management

**Project:** TransitOps

**Priority:** High

**Estimated Complexity:** Medium

**Dependencies**

- ✅ Milestone 0 – Project Foundation
- ✅ Milestone 1 – Authentication & Authorization
- ✅ Milestone 2 – Fleet Management

---

# 1. Epic Objective

Implement the complete Driver Management module.

This epic establishes the Driver domain within TransitOps and provides all core driver management capabilities required by future modules.

This epic is the foundation for:

- Driver Dashboard
- Trip Assignment
- Dispatch
- Digital Inspection
- Safety
- Driver Performance
- Fuel Management
- Incident Management

No future driver-related feature shall duplicate functionality implemented in this epic.

---

# 2. Scope

## Included

### Driver Registry

- Create Driver
- View Driver
- Update Driver
- Soft Delete Driver
- Activate Driver
- Suspend Driver

---

### Driver Search

Support

- Search
- Filter
- Pagination
- Sorting

---

### Driver Verification

Track

- License
- License Category
- License Expiry
- Driver Status

---

### Driver Availability

Support

- Available
- Assigned
- On Trip
- Off Duty
- Suspended
- Inactive

---

### Driver Assignment Readiness

Expose driver readiness information for future Dispatch module.

This epic SHALL NOT implement trip assignment.

Only provide driver availability validation.

---

# 3. Out of Scope

The following belong to later epics.

❌ Driver Dashboard

❌ Trip Execution

❌ Vehicle Inspection

❌ Navigation

❌ Fuel Logs

❌ Driver Performance

❌ Notifications

❌ Incident Reporting

❌ Training

---

# 4. Database Impact

Reuse existing table.

```
driver
```

Do not redesign.

Do not rename columns.

Do not change primary keys.

Do not modify foreign keys.

Do not duplicate data.

Soft delete must remain enabled.

---

# 5. Driver Fields

The Driver entity shall support:

| Field | Required |
|--------|----------|
| Full Name | Yes |
| License Number | Yes |
| License Category | Yes |
| License Expiry | Yes |
| Phone Number | Yes |
| Email | Optional |
| Emergency Contact | Optional |
| Safety Score | Yes |
| Status | Yes |
| Created At | Yes |
| Updated At | Yes |

---

# 6. Driver Status Lifecycle

```
NEW

↓

AVAILABLE

↓

ASSIGNED

↓

ON_TRIP

↓

AVAILABLE

↓

OFF_DUTY

↓

AVAILABLE

↓

SUSPENDED

↓

AVAILABLE

↓

INACTIVE
```

---

## Forbidden Transitions

```
SUSPENDED

↓

ON_TRIP
```

```
INACTIVE

↓

ON_TRIP
```

```
ON_TRIP

↓

SUSPENDED
```

```
ON_TRIP

↓

INACTIVE
```

---

# 7. Business Rules

## Driver

License Number

- Required
- Unique
- Immutable after creation

---

License Expiry

Must be greater than today.

Expired licenses automatically make the driver unavailable.

---

Safety Score

Range

```
0 - 100
```

Default

```
100
```

---

Driver Status

Only valid values:

- AVAILABLE
- ASSIGNED
- ON_TRIP
- OFF_DUTY
- SUSPENDED
- INACTIVE

---

Driver Assignment

A driver

MAY ONLY

have one active assignment.

---

Soft Delete

Drivers shall never be physically deleted.

Only

```
deleted_at
```

is updated.

---

# 8. Backend Tasks

Implement

## Entities

- DriverEntity

---

## Repository

DriverRepository

Support

- CRUD
- Search
- Filtering
- Pagination

---

## DTOs

Create

```
DriverRequest

DriverUpdateRequest

DriverResponse

DriverSearchRequest

DriverStatusResponse

DriverAvailabilityResponse
```

---

## Mapper

Create

```
DriverMapper
```

MapStruct only.

---

## Validators

Create

```
DriverValidator

LicenseValidator

SafetyScoreValidator

DriverAvailabilityValidator
```

---

## Services

Implement

```
DriverService

DriverAvailabilityService
```

Responsibilities

- CRUD
- Validation
- Availability
- Status changes

No business logic inside controller.

---

## Controllers

Create

```
DriverController
```

---

# 9. REST APIs

## CRUD

```http
GET    /api/v1/drivers

GET    /api/v1/drivers/{id}

POST   /api/v1/drivers

PUT    /api/v1/drivers/{id}

DELETE /api/v1/drivers/{id}
```

---

## Search

```http
GET /api/v1/drivers/search
```

Parameters

```
name

licenseNumber

status

page

size

sort
```

---

## Status

```http
PATCH /api/v1/drivers/{id}/activate

PATCH /api/v1/drivers/{id}/suspend

PATCH /api/v1/drivers/{id}/off-duty
```

---

## Availability

```http
GET /api/v1/drivers/{id}/availability
```

Returns

```json
{
  "driverId": 1,
  "available": true,
  "reason": null
}
```

---

# 10. Validation Rules

## Full Name

Required

Minimum

2

Maximum

120

---

## License Number

Required

Unique

Uppercase

Trim spaces

---

## Phone

Must match project phone validator.

---

## License Expiry

Cannot be past.

---

## Safety Score

```
0 <= score <=100
```

---

# 11. Search & Filtering

Support

Search

```
Driver Name

License Number
```

Filters

```
Status

License Category

License Expiry

Safety Score
```

Sorting

```
Name

License Expiry

Safety Score

Created Date
```

Pagination mandatory.

---

# 12. Frontend Tasks

Create pages

```
Driver List

Driver Details

Create Driver

Edit Driver
```

---

Create reusable components

```
DriverTable

DriverForm

DriverCard

DriverStatusChip

DriverSearchBar

DriverFilterPanel

DriverDetailsDialog

DriverAvailabilityBadge
```

---

Create hooks

```
useDrivers()

useDriver()

useDriverSearch()

useDriverAvailability()
```

---

Create services

```
driverApi.ts
```

---

# 13. Permissions

| Role | Permission |
|------|------------|
| Admin | Full CRUD |
| Safety Officer | Full CRUD |
| Fleet Manager | Read |
| Dispatcher | Read |
| Driver | View Own Profile |
| Finance | Read |

---

# 14. UI Requirements

Driver Table

Columns

```
Name

License Number

Category

License Expiry

Safety Score

Status
```

Actions

```
View

Edit

Suspend

Activate

Delete
```

---

Status colors

```
Available

Green

Assigned

Blue

On Trip

Orange

Off Duty

Gray

Suspended

Red

Inactive

Dark Gray
```

---

# 15. Backend Tests

Generate

```
Driver Repository Tests

Driver Service Tests

Driver Controller Tests

Validation Tests

Availability Tests

Security Tests
```

---

# 16. Frontend Tests

Generate

```
Driver Table

Driver Form

Validation

Search

Pagination

Filtering

Permissions
```

---

# 17. Deliverables

Backend

- Driver CRUD
- Search API
- Filter API
- Availability API
- Status API
- Swagger Documentation

Frontend

- Driver List
- Driver Details
- Driver CRUD
- Search
- Filtering
- Pagination

Database

- Flyway migration verification
- Seed data (optional sample drivers)

Documentation

- OpenAPI updated
- Project documentation updated

---

# 18. Definition of Done

This epic is complete when:

- Driver CRUD is fully functional.
- License validation is enforced.
- Driver availability is calculated correctly.
- Search, filtering, sorting, and pagination work.
- Driver status transitions follow lifecycle rules.
- Soft delete is implemented.
- RBAC is enforced.
- DTOs are used for all APIs.
- MapStruct is used for mappings.
- Controllers contain no business logic.
- Unit tests pass.
- Integration tests pass.
- Swagger documentation is complete.

---

# 19. Acceptance Criteria

The implementation is accepted only if:

- Driver records can be created, updated, viewed, and soft deleted.
- License numbers remain unique and immutable.
- Expired licenses automatically make drivers unavailable.
- Status transitions reject invalid operations.
- Availability API returns accurate readiness.
- Search and filtering perform efficiently.
- Security rules from Milestone 1 remain enforced.
- No database schema changes break existing modules.
- Code follows Clean Architecture and project coding standards.

---

# 20. AI Implementation Instructions

The AI implementation agent SHALL:

- Reuse the existing `driver` table.
- Preserve all architecture defined in `backendRequirements.md`.
- Use Spring Boot 3, Java 21, Spring Data JPA, MapStruct, and Jakarta Validation.
- Use DTOs for all API contracts.
- Keep controllers thin; place all business logic in services.
- Use `@Transactional` only in the service layer.
- Implement pagination, filtering, and sorting using Spring Data.
- Update Swagger/OpenAPI documentation.
- Generate unit, integration, and security tests.
- Maintain backward compatibility with Milestones 1 and 2.

The AI SHALL NOT:

- Modify the approved database schema without justification.
- Expose JPA entities directly.
- Duplicate validation logic.
- Introduce business logic into controllers or repositories.
- Implement features belonging to later epics (Dashboard, Trips, Inspection, etc.).