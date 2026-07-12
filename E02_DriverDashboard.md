# E02_DriverDashboard.md

# Epic 02 – Driver Dashboard

**Epic ID:** M03-E02

**Milestone:** M03 – Driver & Safety Management

**Project:** TransitOps

**Priority:** High

**Estimated Complexity:** Medium

**Dependencies**

- ✅ Milestone 0 – Project Foundation
- ✅ Milestone 1 – Authentication & Authorization
- ✅ Milestone 2 – Fleet Management
- ✅ Epic 01 – Driver Management

---

# 1. Epic Objective

Implement the Driver Dashboard.

The Driver Dashboard serves as the driver's operational home screen and provides a real-time overview of assigned work, trip progress, vehicle information, and daily performance.

This dashboard is designed to improve driver productivity by consolidating the most important operational information into a single interface.

This epic SHALL NOT implement trip execution or navigation. Those capabilities belong to subsequent epics.

---

# 2. Scope

## Included

### Dashboard Overview

Provide a personalized dashboard for the authenticated driver.

Display:

- Current Trip
- Upcoming Trips
- Trip Timeline
- Assigned Vehicle
- Estimated Arrival Time (ETA)
- Daily Summary

---

### Trip Summary

Display

- Current Status
- Pickup Location
- Destination
- Cargo Information
- Planned Distance
- Remaining Distance (if available)
- Scheduled Departure
- Estimated Arrival

Read-only.

---

### Vehicle Summary

Display

- Registration Number
- Vehicle Name
- Vehicle Type
- Model
- Fuel Type
- Odometer
- Current Status

Read-only.

---

### Daily Summary

Display

- Trips Assigned Today
- Trips Completed Today
- Distance Driven Today
- Working Hours
- Fuel Logged Today
- Pending Tasks

---

### Upcoming Trips

Display

- Trip Number
- Pickup
- Destination
- Scheduled Time
- Priority
- Status

---

### Trip Timeline

Display chronological events.

Example

```
Assigned

↓

Accepted

↓

Dispatched

↓

Arrived Pickup

↓

Loading

↓

Departed

↓

Delivered

↓

Completed
```

Timeline is read-only.

---

# 3. Out of Scope

The following features belong to later epics.

❌ Accept Trip

❌ Start Trip

❌ Complete Trip

❌ Cancel Trip

❌ Navigation

❌ Inspection

❌ Fuel Logging

❌ Expenses

❌ Notifications

❌ Offline Mode

---

# 4. Database Impact

Reuse existing entities.

- driver
- trip
- vehicle

Do not modify schema.

No new tables.

No schema redesign.

---

# 5. Dashboard Widgets

## Current Trip

Display

- Trip Number
- Status
- Pickup
- Destination
- ETA
- Assigned Vehicle

If no trip exists

Display

```
No Active Trip
```

---

## Upcoming Trips

Display

- Next 5 assigned trips

Columns

- Trip Number
- Pickup
- Destination
- Scheduled Time
- Status

---

## Assigned Vehicle

Display

- Vehicle Name
- Registration Number
- Vehicle Type
- Fuel Type
- Odometer
- Current Status

---

## ETA Card

Display

- Estimated Arrival
- Remaining Time
- Planned Distance

If unavailable

Display

```
ETA Not Available
```

---

## Daily Summary

Display

- Assigned Trips
- Completed Trips
- Distance
- Hours Worked
- Fuel Entries

---

## Trip Timeline

Display

Chronological activity.

Latest activity at top.

---

# 6. Backend Tasks

Create

## Controllers

```
DriverDashboardController
```

---

## Services

```
DriverDashboardService
```

Responsibilities

- Dashboard Aggregation
- Driver Summary
- Current Trip
- Upcoming Trips
- Vehicle Summary
- Daily Metrics

---

## Repositories

Reuse existing repositories.

No duplicate repositories.

---

## DTOs

Create

```
DriverDashboardResponse

CurrentTripResponse

UpcomingTripResponse

VehicleSummaryResponse

DailySummaryResponse

TripTimelineResponse

DriverDashboardFilter
```

---

## Mapper

```
DriverDashboardMapper
```

MapStruct only.

---

# 7. REST APIs

## Dashboard

```http
GET /api/v1/driver/dashboard
```

Returns

```
Dashboard Summary
```

---

## Current Trip

```http
GET /api/v1/driver/dashboard/current-trip
```

---

## Upcoming Trips

```http
GET /api/v1/driver/dashboard/upcoming
```

---

## Daily Summary

```http
GET /api/v1/driver/dashboard/daily-summary
```

---

## Vehicle Summary

```http
GET /api/v1/driver/dashboard/vehicle
```

---

## Timeline

```http
GET /api/v1/driver/dashboard/timeline
```

---

# 8. Business Rules

Dashboard data is only visible to the authenticated driver.

A driver cannot access another driver's dashboard.

Only assigned trips are displayed.

Only assigned vehicle is displayed.

Completed trips are excluded from Current Trip.

Upcoming Trips are ordered by scheduled departure.

Dashboard is read-only.

No state changes occur from dashboard APIs.

---

# 9. Frontend Tasks

Create page

```
DriverDashboardPage
```

---

Create layout

```
DashboardLayout
```

---

Create widgets

```
CurrentTripCard

UpcomingTripsTable

VehicleSummaryCard

DailySummaryCard

TripTimelineCard

ETACard
```

---

Create reusable components

```
MetricCard

StatusBadge

Timeline

DashboardSection

DashboardGrid

InfoCard

EmptyStateCard
```

---

Create hooks

```
useDriverDashboard()

useCurrentTrip()

useUpcomingTrips()

useDriverVehicle()

useDailySummary()

useTripTimeline()
```

---

Create API service

```
driverDashboardApi.ts
```

---

# 10. UI Requirements

Dashboard layout

```
Current Trip

Vehicle Summary

ETA

Daily Summary

Upcoming Trips

Trip Timeline
```

Responsive

Desktop

Tablet

Mobile

Material UI Grid required.

---

# 11. Loading States

Every widget shall support

Loading

Skeleton

Empty

Error

Retry

No blank pages.

---

# 12. Permissions

Only

Driver

may access dashboard.

Administrator

may impersonate driver for support.

All other roles denied.

---

# 13. Performance

Dashboard

Target

```
<500 ms
```

Widget APIs

```
<200 ms
```

Pagination

Required for Upcoming Trips.

---

# 14. Backend Tests

Generate

```
Dashboard Service Tests

Dashboard Controller Tests

Current Trip Tests

Upcoming Trip Tests

Daily Summary Tests

Vehicle Summary Tests

Timeline Tests

Security Tests
```

---

# 15. Frontend Tests

Generate

```
Dashboard Rendering

Widgets

Loading States

Empty States

Responsive Layout

API Integration

Permission Tests
```

---

# 16. Deliverables

Backend

- Dashboard APIs
- Dashboard Service
- DTOs
- Swagger Documentation

Frontend

- Driver Dashboard
- Widgets
- Responsive Layout
- React Query Integration

Documentation

- Updated OpenAPI
- Updated frontend documentation

---

# 17. Definition of Done

The epic is complete when:

- Driver Dashboard loads successfully.
- Current Trip widget displays correctly.
- Upcoming Trips are displayed.
- Vehicle Summary is displayed.
- Daily Summary is displayed.
- Trip Timeline renders correctly.
- ETA widget displays available information.
- Dashboard is responsive.
- Loading, empty, and error states are handled.
- APIs are secured.
- Unit tests pass.
- Integration tests pass.
- Swagger documentation is updated.

---

# 18. Acceptance Criteria

The implementation is accepted only if:

- Every authenticated driver sees only their own dashboard.
- Dashboard widgets display accurate real-time data.
- Dashboard contains no write operations.
- Performance targets are achieved.
- Security rules from Milestone 1 remain enforced.
- Existing modules remain unaffected.
- Code follows Clean Architecture and project coding standards.

---

# 19. AI Implementation Instructions

The AI implementation agent SHALL:

- Reuse the existing Driver, Trip, and Vehicle entities.
- Build the dashboard as a read-only aggregation layer.
- Place all aggregation logic in `DriverDashboardService`.
- Reuse existing repositories instead of creating duplicates.
- Use DTOs and MapStruct for all API responses.
- Implement caching only if defined by project requirements (do not introduce it proactively).
- Secure all endpoints using the existing JWT authentication and RBAC.
- Implement responsive Material UI components.
- Use React Query for dashboard data fetching.
- Handle loading, empty, and error states consistently.

The AI SHALL NOT:

- Modify trip status.
- Accept, start, complete, or cancel trips.
- Modify driver or vehicle records.
- Introduce new database tables.
- Duplicate business logic from other modules.
- Expose JPA entities directly.
