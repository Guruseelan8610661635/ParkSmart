# Smart Parking — Full Stack (React + Spring Boot)

Modern smart parking system with real‑time slot management, secure booking, payments flow, and an admin dashboard.

## Features
- Realtime map and slot availability per location
- Robust booking with vehicle‑type validation
- Checkout → Payments modal auto‑open flow
- Admin dashboard: manage locations, slots, pricing, promotions
- Maintenance mode for slots (distinct from occupied)
- Rich analytics: occupancy, bookings, revenue
- Auditable actions and notifications

## Tech Stack
- Frontend: React 18, Vite, Tailwind CSS, Axios
- Backend: Spring Boot (Java 17), Spring Data JPA, MySQL
- Build: Maven (backend), Vite (frontend)

## Repository Structure
- `Parking-Frontend/` — React app
- `Smart-Parking-Backend/` — Spring Boot app

## Prerequisites
- Node.js 18+
- Java 17 + Maven 3.9+
- MySQL 8.x

## Backend Setup
1. Create your local properties file from the example:
   ```bash
   copy Smart-Parking-Backend\src\main\resources\application.example.properties Smart-Parking-Backend\src\main\resources\application.properties
   ```
2. Edit `Smart-Parking-Backend/src/main/resources/application.properties` with your DB credentials.
3. Start the backend:
   ```bash
   cd Smart-Parking-Backend
   ./mvnw spring-boot:run
   # Windows:
   mvnw.cmd spring-boot:run
   ```

## Frontend Setup
1. Configure API base URL (backend default is http://localhost:8080):
   - Create `Parking-Frontend/.env.local`:
     ```bash
     VITE_API_BASE_URL=http://localhost:8080
     ```
2. Install and run:
   ```bash
   cd Parking-Frontend
   npm install
   npm run dev
   ```

## Key End‑to‑End Flows
- Booking: Vehicle type validation prevents mismatches; clear UI warnings.
- Checkout → Payment: Navigates with state and auto‑opens `PaymentModal`.
- Admin → Locations → Slots: Shows Available, Occupied, Maintenance distinctly.

## Important Notes
- Do not commit secrets. The repo ignores `application.properties`, `.env*`, build outputs, and non‑root markdown docs.
- Use the provided example config files as templates.

## Scripts
- Backend: `mvnw spring-boot:run` (or `mvnw.cmd` on Windows)
- Frontend: `npm run dev`

## License
Proprietary — internal use only.
