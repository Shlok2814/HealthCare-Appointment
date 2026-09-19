# 🏥 PulsePoint Health: Intelligent Clinical Scheduling & Practice Management Ecosystem

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**PulsePoint Health** is a modern, enterprise-grade full-stack healthcare scheduling and practice intelligence platform. Built with a high-performance monorepo architecture, PulsePoint solves critical clinical workflow challenges including **high-concurrency race condition prevention**, **AI symptom triage risk scoring**, **digital prescription generation**, **automated practice leave conflict auto-cancellation**, and **scheduled medication reminder dispatching**.

---

## 🌟 Key Architecture & Capabilities

```
                       ┌─────────────────────────────────────────┐
                       │       PulsePoint Web Application        │
                       │     (React 18 + Vite + TypeScript)      │
                       └────────────────────┬────────────────────┘
                                            │ REST API / JWT
                                            ▼
                       ┌─────────────────────────────────────────┐
                       │          PulsePoint API Core            │
                       │         (Express + Node.js)             │
                       └───────┬────────────┬────────────┬───────┘
                               │            │            │
            ┌──────────────────┴──┐  ┌──────┴─────┐  ┌───┴─────────────────┐
            │  Slot Lock Engine   │  │  AI Triage │  │  Leave Conflict     │
            │  (Hold Expirations) │  │  Service   │  │  Resolution Worker  │
            └──────────┬──────────┘  └──────┬─────┘  └───┬─────────────────┘
                       │                    │            │
                       └────────────────────┼────────────┘
                                            ▼
                               ┌─────────────────────────┐
                               │   PostgreSQL + Prisma   │
                               │   Transactional Storage │
                               └─────────────────────────┘
```

### 1. 🛡️ Concurrency-Safe Slot Reservation Locks
- **5-Minute Slot Holds:** When a patient selects a timeslot, a temporary hold lock is acquired across the system. Other patients see the slot as "Held (Locked)" in real-time with an active expiration countdown.
- **Atomic Transactions:** Prisma transactional isolations ensure zero double-booking race conditions during simultaneous booking attempts.

### 2. 🧠 AI Clinical Symptom Triage & Urgency Scoring
- **Pre-Visit Risk Scoring:** Patient symptom descriptions undergo automated clinical rule & NLP evaluation to classify visit urgency (`ROUTINE`, `MODERATE`, `URGENT`, `EMERGENCY`).
- **Targeted Physician Prompts:** Automatically prepares diagnostic probing questions for doctors before the patient enters the consultation room.

### 3. 💊 Digital Rx Builder & Automated Medication Vault
- **Structured Digital Prescriptions:** Doctors formulate medications with dosage, frequency, and duration.
- **Patient-Friendly Summaries:** Converts complex clinical notes into plain-language care plans.
- **Background Dispatch Workers:** Automatically populates daily reminder queues to ensure patient medication adherence.

### 4. 📅 Intelligent Doctor Leave Conflict Auto-Resolver
- When a clinician marks themselves on leave, the system immediately sweeps the database and **automatically cancels and audits conflicting future appointments** for that date.

### 5. 📊 Clinic Admin Intelligence & KPIs
- Real-time gross revenue tracking, department workload balance, patient volume distributions, and user permission management.

---

## 🔐 Demo Credentials

Use these seeded accounts to explore every facet of the platform:

| Role | Name / Specialty | Email | Password |
| :--- | :--- | :--- | :--- |
| **👑 Clinic Admin** | Eleanor Sterling | `admin@pulsepoint.health` | `Admin@1234` |
| **👨‍⚕️ Cardiologist** | Dr. Sarah Jenkins, MD | `dr.sarah@pulsepoint.health` | `Doctor@1234` |
| **👨‍⚕️ Neurologist** | Dr. Marcus Vance, MD | `dr.marcus@pulsepoint.health` | `Doctor@1234` |
| **👩‍⚕️ Dermatologist** | Dr. Elena Rostova, MD | `dr.elena@pulsepoint.health` | `Doctor@1234` |
| **👨‍⚕️ Orthopedics** | Dr. David Chen, MD | `dr.david@pulsepoint.health` | `Doctor@1234` |
| **👩‍⚕️ Pediatrics** | Dr. Ananya Sharma, MD | `dr.ananya@pulsepoint.health` | `Doctor@1234` |
| **🏥 Patient (Seeded)** | Alex Reynolds | `alex.reynolds@gmail.com` | `Patient@1234` |
| **🏥 Patient 2** | Maya Patel | `maya.patel@gmail.com` | `Patient@1234` |

*(Note: The login page includes 1-click instant demo profile buttons for effortless previewing!)*

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js**: v18.0 or higher
- **PostgreSQL**: Local instance or cloud database (Neon, Supabase, AWS RDS)
- **npm** or **yarn**

### 1. Installation
```bash
git clone https://github.com/Shlok2814/HealthCare-Appointment.git
cd HealthCare-Appointment
npm install
```

### 2. Configure Environment Variables
Create `.env` in `backend/`:
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL="postgresql://pulsepoint:pulsepoint_secret@localhost:5432/pulsepoint_health"
JWT_SECRET="pulsepoint_secure_jwt_secret_token_2026_xyz"
JWT_EXPIRES_IN="7d"
SLOT_HOLD_MINUTES=5
```

### 3. Database Migration & Realistic Seeding
```bash
# Compile shared types library
npm run build:shared

# Initialize DB schema & seed realistic specialists
cd backend
npx prisma db push
npx ts-node prisma/seed.ts
cd ..
```

### 4. Run Development Servers
From the root directory, launch both frontend and backend concurrently:
```bash
npm run dev
```
- **Web App:** `http://localhost:5173`
- **Core API:** `http://localhost:5000/api/v1`

---

## 📁 Repository Monorepo Structure

```
├── shared/                   # Shared TypeScript models, enums & Zod schemas
│   └── src/
│       ├── types/            # DTOs, Enums (UserRole, AppointmentStatus, TriageUrgency)
│       └── schemas/          # Zod validation schemas
├── backend/                  # Express REST API & Prisma Service Layer
│   ├── prisma/
│   │   ├── schema.prisma     # Complete relational data model
│   │   └── seed.ts           # Comprehensive database seeder
│   └── src/
│       ├── config/           # Database & JWT configurations
│       ├── middlewares/      # JWT, RBAC & Zod Request validation
│       ├── routes/           # Modular route endpoints
│       ├── services/         # Booking, SlotHold, AI Triage, Clinical records
│       └── workers/          # Background cron jobs (Hold cleanup, medication alerts)
├── frontend/                 # Modern React 18 + Vite Web Application
│   └── src/
│       ├── components/       # Reusable modular UI components
│       │   ├── booking/      # DoctorCard, SlotPicker, SymptomTriageModal
│       │   ├── patient/      # AppointmentCard, MedicationVault
│       │   ├── doctor/       # ConsultationModal, LeaveManagerModal
│       │   └── admin/        # AnalyticsView, UserManagementView
│       ├── context/          # Auth Context & Session Provider
│       ├── pages/            # LandingPage, AuthPage, Patient, Doctor, Admin Portals
│       └── services/         # Typed API client
└── docker-compose.yml        # Local PostgreSQL & Redis container orchestrator
```

---

## 🛡️ License & Acknowledgments
Licensed under the [MIT License](LICENSE). Built for next-generation clinical workflows and patient care management.
