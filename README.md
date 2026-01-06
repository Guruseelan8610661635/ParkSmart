# ParkSmart — Full Stack (React + Spring Boot)

Comprehensive smart parking platform with real-time maps, bookings, payments, maintenance controls, and rich admin tooling.

## What’s Inside
- User experience: real-time map, slot availability by location, vehicle-type-aware booking, checkout with auto-opening payment modal, booking history.
- Admin experience: manage locations and slots (with maintenance vs occupied), pricing, promotions, subscriptions, reports/analytics, notifications, SMS/email hooks, audit logs.
- Reliability & safety: JWT auth, vehicle-type validation on booking, maintenance state distinct from occupied, secrets externalized (no secrets in repo).

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS, Axios
- Backend: Spring Boot (Java 17), Spring Data JPA, MySQL
- Build: Maven (backend), Vite (frontend)

## Repository Layout
- Parking-Frontend/ — React app
- Smart-Parking-Backend/ — Spring Boot app

## Prerequisites
- Node.js 18+
- Java 17 and Maven 3.9+
- MySQL 8.x

## Backend Setup
1) Create your local properties file from the example (keeps secrets out of git):
```bash
copy Smart-Parking-Backend\src\main\resources\application.example.properties Smart-Parking-Backend\src\main\resources\application.properties
```
2) Edit Smart-Parking-Backend/src/main/resources/application.properties with your values, e.g.:
```
spring.datasource.url=jdbc:mysql://localhost:3306/parksmart?createDatabaseIfNotExist=true&serverTimezone=UTC
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update
app.jwt.secret=REPLACE_WITH_STRONG_32B_SECRET
app.jwt.expiration-ms=3600000
server.port=8080
```
3) Run the backend:
```bash
cd Smart-Parking-Backend
mvnw.cmd spring-boot:run   # Windows
# or
./mvnw spring-boot:run
```

## Frontend Setup
1) Create Parking-Frontend/.env.local (API base points to the backend):
```
VITE_API_BASE_URL=http://localhost:8080
```
2) Install and run:
```bash
cd Parking-Frontend
npm install
npm run dev
```
3) Build for production:
```bash
npm run build
```

## Key Flows (happy path)
- Booking: user picks a slot; vehicle-type mismatch is blocked with clear messaging.
- Checkout → Payment: redirects with state and auto-opens the payment modal.
- Admin locations & slots: per-location stats show Available / Occupied / Maintenance distinctly; maintenance slots are never shown as booked.
- Pricing & promos: configurable via admin (see services under Parking-Frontend/src/services).
- Notifications & audit: hooks for notifications/audit logs are wired in the services layer.

## Running Tests
- Backend: `mvnw.cmd test` (or `./mvnw test`)
- Frontend: add your preferred test runner (e.g., `npm test`) if configured.

## Security & Hygiene
- Secrets stay local: application.properties and .env files are git-ignored; only application.example.properties is tracked.
- JWT secret and expiry are read from properties (`app.jwt.secret`, `app.jwt.expiration-ms`) in Smart-Parking-Backend/src/main/java/com/smartparking/security/JwtUtil.java.
- All non-root markdown docs are ignored by .gitignore; only this README is tracked.

## Deploy Notes (outline)
- Backend: build with `mvnw.cmd package` (or `./mvnw package`) and deploy the jar; set env vars or mount application.properties.
- Frontend: build with `npm run build`; serve the dist/ output from your preferred web server; set VITE_API_BASE_URL at build time.

## Contribution & Branching
- Current working branch: migration-2026-major-rewrite
- Recommended: open a PR into main after pushing updates.

## License
Proprietary — internal use only.
