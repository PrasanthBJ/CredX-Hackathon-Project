



**#demo video link"** - **https://drive.google.com/drive/folders/1E8GRXDbfSshD0oWEnnz9QT4u4hBsxr8s**






# CredX - Campus Placement & Recruiting Portal

CredX is a premium, feature-rich corporate recruiting dashboard system designed to manage campus placements. The platform features tailored workspaces for **Placement coordinators (Admins)**, **Corporate recruiters (Company)**, and **Student Candidates**.

---

## 🏗️ Project Architecture

- **Backend**: Java 17, Spring Boot, Spring Security (JWT-based session authentication), Hibernate JPA, MySQL Database.
- **Frontend**: Vite, React 18, Tailwind CSS, Lucide Icons, Recharts Analytics, Framer Motion.

---

## 🛠️ Prerequisites

Before launching the project, ensure the following are installed:
- **Java Development Kit (JDK)**: Version 17 or higher
- **Node.js**: Version 18 or higher (includes `npm`)
- **MySQL Server**: Running instance configured with a schema database named `credx`

---

## 🚀 Setting Up Local Development

### 1. Database Setup
Create a schema database inside your MySQL server:
```sql
CREATE DATABASE credx;
```

### 2. Spring Boot Backend Configuration
Navigate to the `backend/` folder.
- Create a `.env` file (or set environment variables) with:
  ```env
  DB_URL=jdbc:mysql://localhost:3306/credx?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
  DB_USERNAME=your_mysql_username
  DB_PASSWORD=your_mysql_password
  SMTP_USERNAME=your_email@gmail.com
  SMTP_PASSWORD=your_app_password
  ```
- Build and run the backend wrapper:
  ```bash
  # Windows
  .\mvnw.cmd spring-boot:run
  
  # macOS/Linux
  ./mvnw spring-boot:run
  ```
  The API server starts on `http://localhost:8080`.

### 3. Vite React Frontend Configuration
Navigate to the `frontend/` folder.
- Install node dependencies:
  ```bash
  npm install
  ```
- Run the local dev server:
  ```bash
  npm run dev
  ```
  The application is served at `http://localhost:5173`.

---

## 📱 Running & Accessing on Other Devices (Local Network)

To run the application and access it from other devices (e.g., smartphones, tablets, or other laptops) on the same Wi-Fi/local network:

### 1. Identify Your Host IP Address
Get your computer's local IP address:
- **Windows (PowerShell/CMD)**: Run `ipconfig` (look for IPv4 Address, e.g., `192.168.1.15`).
- **macOS/Linux (Terminal)**: Run `ifconfig` or `ip a`.

### 2. Configure the Backend (Spring Boot)
Ensure Spring Boot binds to all interfaces (`0.0.0.0`) so other devices can access it. By default, Spring Boot binds to all interfaces. If restricted, add this to your properties:
```yaml
server:
  address: 0.0.0.0
```

### 3. Configure the Frontend (Vite)
To serve Vite externally, configure the host flag:
- Start the server using the `--host` flag:
  ```bash
  npm run dev -- --host
  ```
  *Alternatively, edit `vite.config.js` and set:*
  ```javascript
  server: {
    host: true
  }
  ```

### 4. Update the Frontend Environment API URL
Create/Edit the `.env` file inside the `frontend/` folder to direct requests to the host machine's IP instead of `localhost`:
```env
VITE_API_BASE_URL=http://192.168.1.15:8080/api
```
*(Replace `192.168.1.15` with the Host IP address identified in step 1).*

### 5. Accessing from Other Devices
Connect your phone, tablet, or another laptop to the **same Wi-Fi network**, open a web browser, and navigate to:
```text
http://192.168.1.15:5173
```

---

## 🔮 Future Roadmap (Things to Add in the Future)

Here is a list of features slated for future implementation to further elevate CredX:

### 1. AI-Driven Resume Analyzer & Scorecard
- Integrate LLM models to automatically parse PDF resumes uploaded by candidates and rate their alignment with active job descriptions.
- Auto-extract keywords, certifications, and skills to verify profile fields automatically.

### 2. Interactive Interview Scheduler & Calendar Sync
- Integrate a scheduler modal for recruiters to book interviews with candidate lists.
- Sync with Google Calendar / MS Outlook API to dispatch calendar invites and reminders to students.

### 3. Real-Time Chat & Communications
- Implement WebSockets/Socket.IO communication channels so recruiters and placement admins can chat directly with candidates about application statuses.

### 4. Dynamic CSV/Excel Candidate Exporter
- Provide placement coordinators with instant reports by implementing a "One-Click Export" button to compile student profiles, test scores, and job placement progress into spreadsheet files.
