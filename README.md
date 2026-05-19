# PulseCore---E-Blood-Management-Backend-API
🩸 PulseCore - E-Blood Management Backend API
PulseCore is a high-performance, secure backend service and RESTful API designed to power digital blood bank networks. It handles the core business logic, relational database management, and data pipelines required to seamlessly connect voluntary donors, hospitals, and blood banks during critical medical emergencies.

Core Architectural Features
Role-Based Access Control (RBAC): Secure authentication pipeline separating permissions for Admins, Blood Bank Staff, and Donors/Recipients.
Inventory Automation: Relational database schemas designed to track blood units, manage storage expiration timelines, and prevent stock deficits.
Smart Matching Engine: Query-optimized filtering logic to instantly identify compatible blood groups based on universal donor/recipient rules.
Emergency Request Queue: A transaction-safe pipeline that ingests, prioritizes, and tracks urgent blood requests from verified hospitals.
Data Integrity: Strict server-side validation and sanitized queries to guarantee precise tracking of critical medical assets.

Tech Stack & DependenciesBackend Runtime: 
Node.js / Express -or- Python / Flask
Database Engine: MySQL (Relational schema for strong ACID compliance)
Authentication: JSON Web Tokens (JWT) & bcrypt password hashing

Database Architecture
The backend relies on a normalized relational database design to maintain absolute data integrity across entities. The core schema relations map out as follows:[Users] 1 ------- 1 [Donor Profiles]
   |
   | 1 ----------- 1 [Blood Bank Staff]
                       |
                       | 1 ----------- ♾️ [Blood Inventory]
                                                ^
[Hospitals] 1 ------------------------- ♾️ [Blood Requests]

Core API 
EndpointsAll requests require content-type headers configured to application/json. Protected endpoints require a valid Bearer Token passed via the authorization header.

🔑 Authentication & Users 
Method Endpoint Access Description 
POST/api/auth/registerPublicRegisters a new user (Donor/Recipient/Staff).
POST/api/auth/loginPublicAuthenticates credentials and returns a JWT.
GET/api/users/profileProtectedRetrieves the authenticated user's profile details.

📦 Blood Stock & Inventory
Method Endpoint Access Description
GET/api/inventoryPublicFetches current stock counts grouped by blood type.
POST/api/inventory/addStaff/AdminLogs a newly collected or received blood unit.
PUT/api/inventory/update/:idStaff/AdminAdjusts stock volume or status (e.g., Expired/Dispatched).

🚨 Emergency Requests & Matching
Method Endpoint Access Description
POST/api/requests/createHospital/UserInitiates a new emergency request for a specific blood type.
GET/api/requests/activePublicReturns all unfulfilled, high-priority blood shortages.
GET/api/match/donors/:blood_typeStaff/AdminQueries the database for eligible matching donors nearby

Local Installation & Setup

Follow these steps to spin up the development server locally:
1. Clone the Repository
Bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME

2. Configure Environment Variables
Create a .env file in the root directory and populate it with your specific database credentials:

Code snippet

PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=eblood_db
JWT_SECRET=your_super_secret_jwt_key

3. Initialize the Database

Import your initial database schema into your local MySQL instance:

Bash
mysql -u your_mysql_username -p eblood_db < database_schema.sql

4. Install Dependencies & Launch
Bash

# For Node.js setups:
npm install
npm run dev

# For Python/Flask setups:
pip install -r requirements.txt
python app.py

The server will initialize and begin listening for incoming requests on http://localhost:5000.

Developer Note: Remember to replace the placeholder file names (like database_schema.sql) and terminal setup scripts with the exact commands matching the framework you built this with before committing to GitHub!
