# MEC Lost & Found

Campus Lost & Found web application for Model Engineering College (MEC) to report lost items, post found belongings, and automatically match them[cite: 2].

## Features
- Post found items and report lost belongings with contact details and optional photo uploads[cite: 2].
- Automatic cross-matching between lost and found reports based on category and keywords[cite: 2].
- Search and filter items by category (`Electronics`, `ID Cards`, `Books`, `Others`) and status (`Found`, `Lost`, `Resolved`)[cite: 2].
- Mark items or matched pairs as Returned (`Resolved`)[cite: 2].

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript[cite: 2]
- **Backend:** Node.js, Express.js[cite: 3, 5]
- **Database:** MongoDB Atlas, Mongoose[cite: 3, 5]
- **Uploads:** Multer[cite: 3, 7]

## Project Structure
```text
lost-and-found-app/
├── backend/
│   ├── models/Item.js
│   ├── routes/itemRoutes.js
│   ├── uploads/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   └── src/index.html
├── images/
├── index.html
├── package.json
└── README.md
```

## Local Setup

1. Clone the repository and install dependencies:
```bash
git clone https://github.com/li-yah-h/lost-and-found-app.git
cd lost-and-found-app/backend
npm install
```

2. Create `backend/.env` and add your MongoDB Atlas URI[cite: 5]:
```env
MONGO_URI=mongodb+srv://<db_username>:<db_password>@cluster0.xr06blz.mongodb.net/
PORT=5000
```

3. Start the server:
```bash
npm start
```
App runs at `http://localhost:5000`[cite: 5].

## API Endpoints
- `GET /api/health` — Server and DB status[cite: 5]
- `GET /api/items` — Fetch all items[cite: 7]
- `POST /api/items` — Create an item (`multipart/form-data`)[cite: 7]
- `PATCH /api/items/:id` — Update item status (`Resolved`)[cite: 7]
- `DELETE /api/items/:id` — Delete an item[cite: 7]
