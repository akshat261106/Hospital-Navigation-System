# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
Make sure you have Node.js installed (v16 or higher)
```bash
node --version  # Should show v16 or higher
npm --version   # Should show npm version
```

### 1️⃣ Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2️⃣ Start the Backend Server

Run this command in the project root:
```bash
npm start
```

You should see:
```
🏥 Hospital Navigation Server running on http://localhost:5000
```

✅ Server is ready when you see this message

### 3️⃣ Start the Frontend (New Terminal)

```bash
npm run frontend-dev
```

You should see output showing the Vite server is running on `http://localhost:5173`

### 4️⃣ Open Your Browser

Visit: **http://localhost:5173**

You're done! The app is running! 🎉

---

## 📍 Available Pages

1. **Home** (`/`) - Main page with search functionality
2. **Services** (`/services`) - View medical services and doctors
3. **Facilities** (`/facilities`) - Find hospital facilities
4. **Help** (`/help`) - FAQs and contact information
5. **Location** (`/location`) - interactive map and navigation
6. **Login** (`/login`) - User authentication

---

## 🔍 Testing the Navigation

1. Open the app at http://localhost:5173
2. Click "Find Your Location in the Hospital" or use the search
3. Select a destination from the dropdown
4. Click "Start Navigation"
5. View the interactive map with the route highlighted

---

## 🛠️ What's Working

✅ Backend API server with all endpoints
✅ Frontend React app with all pages
✅ Navigation search functionality
✅ Interactive hospital map
✅ Services listing
✅ Facilities locator
✅ Help & FAQs
✅ Responsive design

---

## ⚠️ If Something Goes Wrong

### Backend won't start
- Check if port 5000 is already in use
- Try: `npx kill-port 5000` (if installed)
- Then run `npm start` again

### Frontend won't start
- Check if port 5173 is in use
- Delete `frontend/node_modules` and run `npm install` again
- Clear browser cache (Ctrl+Shift+Delete)

### Navigation not working
- Make sure backend is running on http://localhost:5000
- Check browser console (F12) for errors
- Visit http://localhost:5000/api/health in your browser to verify backend

### CORS errors
- Backend is likely not running
- Make sure both servers are started

---

## 📦 For Production Build

```bash
npm run build
```

This creates optimized files in `frontend/dist/`

---

## 🎯 Next Steps

- Explore the code in `frontend/src/`
- Check out `server.js` for backend logic
- Review hospital data in API responses
- Customize hospital locations in `server.js`

---

## 📞 API Testing

You can test APIs using browser or tools like Postman:

```bash
# Test backend
curl http://localhost:5000/api/health

# Get all locations
curl http://localhost:5000/api/locations

# Search
curl "http://localhost:5000/api/search?q=pharmacy"

# Find path (POST)
curl -X POST http://localhost:5000/api/find-path \
  -H "Content-Type: application/json" \
  -d '{"startId":"reg-counter","endId":"pharmacy"}'
```

---

**Enjoy your Hospital Navigation System! 🏥**
