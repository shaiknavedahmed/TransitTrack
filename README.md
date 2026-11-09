# 58. Public Transport Tracking and Route Information Portal

A full-stack, enterprise-grade public transportation fleet monitoring, timetable broadcasting, and transit operations platform. Designed according to official public transit regulatory standards, featuring real-time GPS simulation telemetry, role-based access control across 4 distinct user roles, and automated generation of all 4 mandatory regulatory reports.

---

## 📋 Project Specifications Compliance Matrix

| Reference Specification | Requirement | Project Implementation |
| :--- | :--- | :--- |
| **Minimum Screens** | 8 screens (minimum) | **8 Dedicated Full Screens** + Global Navigation & Live Alert Ticker |
| **User Roles** | Admin, Transport Operator, Driver, Passenger | **4 Distinct Interactive Roles** with 1-click test switcher & RBAC matrix |
| **Mandatory Reports** | 4 Regulatory Reports | **Route-wise Schedule**, **Vehicle Activity**, **Passenger Feedback**, **Service Delay** Reports (with CSV Export & Print view) |
| **Key Functionalities** | Manage routes, stops, schedules, vehicles | Full CRUD & status toggles in Transport Operator & Admin screens |
| **Timetable Publishing** | Publish route & timetable information | Interactive Timetable viewer with 1-click "Publish to Public" toggle |
| **GPS Vehicle Location** | Display vehicle location through GPS / simulation | **Real-Time GPS Simulation Engine** with animated Leaflet markers & telemetry |
| **Delays & Service History** | Delay updates, feedback, service history | Active advisory banner, delay logging modal, passenger review portal |

---

## 📱 The 8 Screens Breakdown

### Screen 1: Live Transit Map & Real-time Vehicle Tracker (`live-map`)
* **Interactive Leaflet / OpenStreetMap Canvas**: Displays dynamic colored route polylines and live moving transit markers.
* **Real-time GPS Simulation**: Vehicles continuously advance along route waypoints with calculated heading angles and speeds.
* **Corridor Filters**: Switch between All Corridors, Line 101 Express, Line 204 Tram, Line 305 Rapid, Line 408 Airport Shuttle.
* **Live Telemetry Drawer**: Inspect selected vehicle speed (km/h), punctuality variance, battery/fuel %, passenger load level, driver identity, and onboard amenities (5G Wi-Fi, Climate AC, CCTV).
* **Stop Station Cards**: Click any stop pin to inspect code, fare zone, and passenger amenities.

### Screen 2: Route Directory & Timetable Information (`routes`)
* **Corridor Directory**: Search and filter corridors by mode (Bus, Tram, Express Shuttle).
* **Interactive Timetable Generator**: View Weekday vs Weekend departure schedules, trip IDs, and terminal arrival estimates.
* **Stop Sequence Timeline**: Vertical station sequence with distance, fare rules, and transfer points.
* **Publishing Status**: Visible "Published" vs "Draft" indicators for passengers and operators.
* **Data Export**: Export complete timetable to CSV or trigger print-friendly timetable sheets.

### Screen 3: Passenger Experience & Service Alerts Hub (`feedback`)
* **Passenger Rating Form**: Submit 1 to 5 star ratings, feedback categories (Cleanliness, Driving Safety, Punctuality, Staff Courtesy), with optional anonymous posting.
* **CSAT Satisfaction Scorecard**: Aggregated 4.6 / 5.0 score with positive sentiment ratio breakdown.
* **Community Review Feed**: Displays verified passenger comments and official Transit Authority responses.
* **Active Delay Advisories**: Live list of active transit delays with duration, cause, and mitigation action.
* **Service Disruption History**: Historical reliability log of cleared incidents.

### Screen 4: Unified Authentication & Role Gateway (`auth`)
* **1-Click Role Switcher**: Quick test cards for Admin, Transport Operator, Driver, and Passenger.
* **Role Credentials Simulator**: Simulated email/password authentication with state persistence.
* **Role-Based Access Matrix**: Interactive permission table mapping access across screens and actions.

### Screen 5: Admin Master Operations Center (`admin`)
* **Executive Transit KPIs**: Active fleet units, network on-time rate (95.4%), active delay count, and passenger review volume.
* **Emergency Network Broadcast**: Console to broadcast urgent system-wide advisories across all user screens.
* **Staff Directory**: Register and manage drivers, operators, and supervisors with badge IDs and license clearances.
* **Immutable Audit Trail**: Live log of all administrative actions with timestamps, roles, and IP addresses.

### Screen 6: Transport Operator Dispatch & Route Center (`operator`)
* **Route Management**: Create and configure transit corridors, operating hours, frequencies, and fares.
* **Transit Stop Manager**: Add stops with GPS geo-coordinates, zone codes, and passenger amenities.
* **Fleet Management**: Track vehicle health, battery charge, distance covered, and toggle maintenance status.
* **Dispatch Delays**: Post official delay notices with root cause selection and affected stop alerts.

### Screen 7: Driver Cockpit & GPS Broadcaster (`driver`)
* **Shift Instrument Cluster**: Digital cockpit showing vehicle ID, live cruising speed (km/h), delay variance, and battery level.
* **Live GPS Telemetry Broadcaster**: Displays live latitude, longitude, and bearing heading.
* **Cruise Speed / Throttle Slider**: Adjust speed dynamically between 0 km/h and 80 km/h.
* **Stop Check-in**: Advance through route stops with one click ("Check-in at Next Stop").
* **Cabin Occupancy Selector**: Set passenger crowding level (Empty, Low, Moderate, Crowded, Full).
* **Field Delay Logger**: One-click quick presets (+5m, +10m, +15m) to report traffic jams directly to Dispatch.

### Screen 8: Mandatory Regulatory Reports & Analytics (`reports`)
Dedicated hub containing all 4 required reports:
1. **Route-wise Schedule Report**: Trip ID, planned vs actual departures/arrivals, variance minutes, on-time rate %, and status.
2. **Vehicle Activity Report**: Vehicle registration, model, mode, daily distance covered, battery/fuel %, assigned driver, and status.
3. **Passenger Feedback Report**: Feedback ID, passenger name, star rating, feedback category, sentiment, comments, and resolution state.
4. **Service Delay Report**: Incident ID, route affected, delay duration, root cause category, reporter, severity, and mitigation action.
* **Export Features**: 1-click **Export to CSV** and **Print Official Report** available for every report!

---

## 🛠️ Technology Stack & Architecture

- **Frontend Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom transit color palette and smooth animations
- **Mapping & GIS**: Leaflet 1.9 with OpenStreetMap tiles and custom SVG vehicle markers
- **Icons**: Lucide React
- **State Management**: Reactive React Context with LocalStorage persistence and GPS Simulation Engine
- **DevOps**: Docker (multi-stage build), Nginx Alpine, Docker Compose, GitHub Actions CI/CD workflow

---

## 🚀 Running the Project

### 1. Local Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Production Build
```bash
# Validate types and create production bundle
npm run build

# Preview production build locally
npm run preview
```

### 3. Docker Deployment
```bash
# Build and run with Docker
docker build -t metro-transit-portal .
docker run -p 8080:80 metro-transit-portal
```
Access the application at [http://localhost:8080](http://localhost:8080).

### 4. Docker Compose
```bash
docker compose up --build -d
```

---

## 👥 Demo Role Credentials (Available in Role Gateway)

| Role | Name | Email | Clearance / Badge |
| :--- | :--- | :--- | :--- |
| **Admin** | Sarah Jenkins | `admin@metrotransit.org` | DIR-8801 (Root) |
| **Transport Operator** | Marcus Vance | `operator@metrotransit.org` | DISP-402 (Dispatch) |
| **Driver** | David Rodriguez | `driver@metrotransit.org` | DRV-1099 (CDL-B) |
| **Passenger** | Elena Rostova | `passenger@gmail.com` | Commuter Card 721 |

*(You can also use the 1-click role switcher in the top navigation bar at any time).*

