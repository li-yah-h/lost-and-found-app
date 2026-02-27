# 🔍 MEC Lost & Found

A web app for Model Engineering College students to report and recover lost items on campus.

## Tech Stack
HTML · CSS · JavaScript · Node.js · Express · MongoDB · Multer

## Getting Started

```bash
cd backend
npm install
cp .env.example .env   # add your MongoDB URI
npm run dev
```

Open `frontend/App.html` with **Live Server** in VS Code.

## API
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items |
| POST | `/api/items` | Create item |
| PATCH | `/api/items/:id` | Update status |
| DELETE | `/api/items/:id` | Delete item |

## License
MIT
