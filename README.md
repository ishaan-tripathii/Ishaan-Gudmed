# Gudmed Healthcare Platform

## Project Structure
```
/
├── backend/           # Backend API service
├── my-project/       # Frontend application
├── admin-dashboard/  # Admin dashboard
└── render.yaml       # Render deployment configuration
```

## Deployment
This project is deployed on Render:
- Backend: https://gudmed-backend.onrender.com
- Frontend: https://my-project.onrender.com
- Admin Dashboard: https://gudmed-admin.onrender.com

## Development
1. Clone the repository
2. Install dependencies in each directory:
   ```bash
   cd backend && npm install
   cd ../my-project && npm install
   cd ../admin-dashboard && npm install
   ```
3. Start the development servers:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd my-project && npm start
   
   # Terminal 3 - Admin Dashboard
   cd admin-dashboard && npm start
   ```
