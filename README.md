# PlasmaSurge Orchestrator: PulseCore Backend API v2.0
> **High-Performance, ACID-Compliant Medical Logistics Service & Event-Driven RESTful API Layer**

---

## System Architecture & Data-Flow Topology

The PulseCore backend architecture is engineered on a decoupled paradigm designed to handle high-throughput telemetry data and transactional inventory updates with deterministic latency. The network topology guarantees strict separation of concerns between reactive visual layers, the Express middleware gate, and a highly normalized relational database engine to maintain zero-fault medical asset operations.

### System Topology Network Map

```text
       [ EVENT TRANSMISSION LAYER ]              [ CORE RUNTIME GATEWAY ]             [ DATA PERSISTENCE ]
       
+------------------------------------------+
|  High-Contrast Obsidian Fluid Interface  |
|  (HTML5 WebGL Shaders / Dynamic SVGs)    |
+--------------------+---------------------+
                     |
                     | 1. HTTP Rest / WebSockets
                     ▼
+------------------------------------------+     2. Intercept Token    +----------------------------------+
|   Express 5.0 Core Pipeline Gateway      +-------------------------->|    JWT Security Authentication   |
|   (Socket.IO Room-Isolated Multiplexer)  |                           |    & Domain Verification Guard   |
+--------------------+---------------------+                           +----------------------------------+
                     |
                     | 3. Sanitized Query / Write Execution
                     ▼
+------------------------------------------+     If Live Conn Dropped  +----------------------------------+
|      Relational Database Routing Proxy   +-------------------------->|    Resilient JSON Sync Queue     |
|         (Connection Pool Router)         |                           |    (Local Outage Cache File)     |
+--------------------+---------------------+                           +--------------------+-------------+
                     |                                                                      |
                     | 4. ACID-Compliant Storage Commit                                     | 5. Auto Flush
                     ▼                                                                      |    (Every 15s)
+------------------------------------------+                                                |
|       MySQL Enterprise Database          |<-----------------------------------------------+
|      (Normalized Relational Storage)     |
+------------------------------------------+
```

## Core Architectural Specifications:
Role-Based Access Control (RBAC): Token-intercepting security gateways isolate routing networks, separating administrative system nodes, clinical/blood bank staff interfaces, and secure donor/recipient diagnostic profile views.

Inventory Lifecycle Automation: Database constraints track real-time blood pack units, automate storage shelf-life alerts based on cold-chain expiration timeframes, and block system distribution actions if stock balances drop below safety limits.

Smart Matching Matrix: High-performance indexing optimizes relational queries to cross-match universally valid donor-recipient antigen groups instantly, factoring in geographic proximity boundaries.

Fault-Tolerant Cache Serialization: If communication with the core MySQL storage adapter is severed, active incident logging streams drop instantly into an isolated JSON failover queue. An internal background tracking daemon monitors connection pools, automatically flushing backlogged operations into the relational tables once connection stability is restored.

## Normalized Database Architecture
PulseCore relies on a strict relational data model to enforce business logic rules and prevent data anomalies. Foreign key constraints maintain relational mapping links across the entire data schema:
```
[ Users ] 1 ─── 1 [ Donor Profiles ]
   │
   ├─── 1 ─── 1 [ Blood Bank Staff ]
   │
   └─── 1 ─── ♾ [ Blood Inventory ]
                  ▲
                  │
[ Hospitals ] 1 ──┴── ♾ [ Blood Requests ]
```
## Technology Stack & Communication Protocols
Backend Runtime Engine: Node.js LTS Deployment Grid

Web Server Framework: Express 5.0 Core Application Router

Database Management System: MySQL Server (ACID-Compliant Relational Design)

Object Relational Management (ORM): Sequelize / Native Pool Connections

Encryption & Security Protocols: JSON Web Tokens (JWT) & bcrypt password hashing

Bi-directional Network Multiplexing: Socket.IO event streams

## Core API Routing Interface Matrix:
All incoming network payloads require content-type configurations set to application/json. Protected endpoints require a valid, non-expired Bearer Token passed inside the HTTP authorization header.

Authentication & Identity Nodes
```
Method	Endpoint	Access Level	Functional Objective Description
POST	/api/auth/register	Public	Registers a new application node profile (Donor/Recipient/Staff).
POST	/api/auth/login	Public	Validates administrative hashes and returns an authenticated JWT signature.
GET	/api/users/profile	Protected	Decodes authentication tokens
```
Blood Bank Inventory Telemetry
```
Method	Endpoint	Access Level	Functional Objective Description
GET	/api/inventory	Public	Queries current storage aggregate volumes grouped by antigen categorization.
POST	/api/inventory/add	Staff / Admin	Logs a newly acquired or verified testing pack blood unit.
PUT	/api/inventory/update/:id	Staff / Admin	Modifies operational package status parameters (e.g., Expired, Dispatched).
```
Emergency Requests & Real-Time Matching
```
Method	Endpoint	Access Level	Functional Objective Description
POST	/api/requests/create	Hospital / User	Deploys a new emergency incident allocation request across live channels.
GET	/api/requests/active	Public	Pulls an open list of high-priority unfulfilled blood unit shortages.
GET	/api/match/donors/:blood_type	Staff / Admin	Triggers spatial indexing parameters to isolate matching donors in a geofence.
```
## Local Installation & Workspace Setup
Execute these instructions sequentially to initialize your local development workspace server:
1. Clone the Source Repository
   
Bash
git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
cd YOUR_REPO_NAME

2. Configure Environment Variables

Create a file named exactly .env inside your root directory and inject your server parameters:
Code snippet
```
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=eblood_db
JWT_SECRET=your_super_secure_jwt_secret_key_2026
```

3. Initialize the Relational Database Schema

Verify that your local MySQL service instance is active. Import the enterprise target tracking schema rules through your database management CLI:
Bash

mysql -u your_mysql_username -p eblood_db < schema.sql

4. Compile Dependencies & Launch Runtime

Bash
Download and initialize structural node modules
npm install

Launch the operational server under active change-monitoring watch loops
npm run dev

The console gateway will boot, running a safe connection sweep against your MySQL database pool and exposing network entry lines on http://localhost:5000.

## System Licensing & Compliance
Distributed under the ISC Enterprise Security Framework License. Built to achieve compliance guidelines governing critical healthcare informatics pipelines.

---

###  Terminal Commands to Commit Now
Once you save that text inside your local `README.md` file, run these commands in your console to push it live to your repository:

```bash
git add README.md
git commit -m "docs: complete rewrite of enterprise architecture documentation specs"
git push origin main
