# 🏥 Hospital Navigation System - Installation & Verification Checklist

## ✅ Pre-Installation Checklist

- [ ] Node.js is installed (v16 or higher)
- [ ] You have npm installed
- [ ] You have a code editor ready (VS Code recommended)
- [ ] You have 2 terminals available

---

## 📦 Installation Steps

### Step 1: Install Backend Dependencies
```bash
# In project root directory
npm install
```
**Expected Output:** "added X packages"

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```
**Expected Output:** "added X packages" (in frontend)

### Step 3: Verify Installation
```bash
# Check if server.js exists
dir server.js

# Check if backend has node_modules
dir frontend/node_modules
```

---

## 🚀 Starting the Application

### Terminal 1: Start Backend Server
```bash
npm start
```

**Expected Output:**
```
🏥 Hospital Navigation Server running on http://localhost:5000
API endpoints:
  - GET  /api/locations - Get all locations
  - GET  /api/graph - Get hospital graph
  - POST /api/find-path - Find path between locations
  - GET  /api/services - Get all services
  - GET  /api/facilities - Get all facilities
  - GET  /api/search - Search locations
```

✅ **Verification:** Backend is running if you see the above messages

### Terminal 2: Start Frontend Development Server
```bash
npm run frontend-dev
```

**Expected Output:**
```
  VITE v8.0.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Verification:** Frontend is ready when you see "Local: http://localhost:5173/"

---

## 🌐 Testing the Application

### Step 1: Open in Browser
Visit: **http://localhost:5173**

✅ **Verification:** You see the Hospital Navigation homepage

### Step 2: Test Search
1. Type "pharmacy" in the search box
2. You should see "Pharmacy" in the dropdown results

✅ **Verification:** Search returns relevant results

### Step 3: Test Navigation
1. Click "Find Your Location in the Hospital"
2. Select any destination from the dropdown
3. Click "Start Navigation"
4. You should see an interactive map with route highlighted

✅ **Verification:** Map displays with path highlighted

### Step 4: Test Other Pages
Visit these routes and verify they load:
- [ ] http://localhost:5173/ - Home page ✅
- [ ] http://localhost:5173/services - Services page ✅
- [ ] http://localhost:5173/facilities - Facilities page ✅
- [ ] http://localhost:5173/help - Help page ✅
- [ ] http://localhost:5173/location - Location page ✅
- [ ] http://localhost:5173/login - Login page ✅

### Step 5: Test API Endpoints
In your browser, visit:
- http://localhost:5000/api/health
- http://localhost:5000/api/locations
- http://localhost:5000/api/services
- http://localhost:5000/api/facilities

✅ **Verification:** All return JSON data

---

## 🔍 System Verification Checklist

### Backend (`server.js`)
- [ ] File exists at project root
- [ ] Contains 11+ API endpoints
- [ ] Has hospital graph data
- [ ] Pathfinding algorithm implemented
- [ ] CORS enabled
- [ ] Running on port 5000

### Frontend (`frontend/src/`)
- [ ] App.jsx has all page imports
- [ ] All 6 pages created and functional
- [ ] Components folder has Header, Footer, HospitalMap
- [ ] Styles folder has CSS for all pages
- [ ] Utils folder has data.js and pathfinder.js

### Pages
- [ ] Home.jsx - Search & hero section
- [ ] Services.jsx - Services list
- [ ] Facilities.jsx - Facilities list
- [ ] Help.jsx - FAQs & contact
- [ ] Location.jsx - Navigation interface
- [ ] Login.jsx - Authentication

### Components
- [ ] Header.jsx - Navigation bar
- [ ] Footer.jsx - Footer section
- [ ] HospitalMap.jsx - SVG map visualization

### Styling
- [ ] App.css - Global styles
- [ ] Home.css - Home page styles
- [ ] Services.css - Services page styles
- [ ] Facilities.css - Facilities page styles
- [ ] Help.css - Help page styles
- [ ] Location.css - Location page styles
- [ ] Login.css - Login form styles
- [ ] HospitalMap.css - Map component styles

---

## 🛠️ Troubleshooting

### Frontend Won't Start

**Problem:** EADDRINUSE error
```
Address in use on port 5173
```

**Solution:**
```bash
# Kill the process using port 5173
# Windows:
npx kill-port 5173

# Mac/Linux:
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

Then run: `npm run frontend-dev` again

---

### Backend Won't Start

**Problem:** EADDRINUSE error
```
Address in use on port 5000
```

**Solution:**
```bash
# Kill the process using port 5000
npx kill-port 5000
```

Then run: `npm start` again

---

### Blank Frontend Page

**Problem:** All white page, no content
```
Solutions:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+F5)
3. Check browser console for errors (F12)
4. Verify backend is running
```

---

### API Returns 404

**Problem:** Cannot GET /api/locations
```
Solution:
1. Verify backend is running
2. Check http://localhost:5000/api/health
3. Make sure port 5000 is correct
4. Check for CORS errors in browser console
```

---

### Cannot Connect to Backend

**Problem:** Network error or CORS error
```
Solution:
1. Check if backend is running ('npm start' output)
2. Verify http://localhost:5000 is accessible
3. Check browser console for specific errors
4. Ensure CORS is enabled in server.js (it is by default)
```

---

## 📊 Verification Matrix

| Feature | Status | Test URL |
|---------|--------|----------|
| Home Page | ✅ | http://localhost:5173/ |
| Services | ✅ | http://localhost:5173/services |
| Facilities | ✅ | http://localhost:5173/facilities |
| Help | ✅ | http://localhost:5173/help |
| Location | ✅ | http://localhost:5173/location |
| Login | ✅ | http://localhost:5173/login |
| API Health | ✅ | http://localhost:5000/api/health |
| Get Locations | ✅ | http://localhost:5000/api/locations |
| Get Services | ✅ | http://localhost:5000/api/services |
| Get Facilities | ✅ | http://localhost:5000/api/facilities |
| Find Path | ✅ | POST to http://localhost:5000/api/find-path |

---

## 🎯 Success Indicators

### ✅ Everything is Working If:
1. Both servers start without errors
2. Browser shows the home page at http://localhost:5173
3. Search functionality works
4. Navigation shows interactive map
5. All pages load properly
6. No console errors (F12 in browser)
7. API calls respond with data

### ❌ Something is Wrong If:
1. Blank white page
2. Network errors in console
3. API returns 404 or 500
4. Buttons don't respond
5. Port conflicts
6. Missing files/components

---

## 📞 Quick Support

### Check Logs
1. **Backend logs:** Look at terminal running `npm start`
2. **Frontend logs:** Look at terminal running `npm run frontend-dev`
3. **Browser logs:** Open DevTools (F12) → Console

### API Testing
```bash
# Test backend with curl
curl http://localhost:5000/api/health

# Should return:
# {"status":"Server is running","timestamp":"2024-..."}
```

---

## 🎉 Congratulations!

If all checks pass, your Hospital Navigation System is:
- ✅ Fully installed
- ✅ Properly configured
- ✅ Successfully running
- ✅ Ready to use

**Start exploring:** http://localhost:5173

---

## 📚 Next Steps

1. **Customize Hospital Data** - Edit `server.js` to change locations/services
2. **Modify Colors** - Change `#2b7de9` in CSS files to your brand color
3. **Add Images** - Add hospital images to `frontend/src/assets/`
4. **Deploy** - Host on Heroku, Railway, Vercel, etc.

---

## 📝 Important Files Summary

| File | Purpose |
|------|---------|
| `server.js` | Backend API server |
| `frontend/src/App.jsx` | Main React app |
| `frontend/src/pages/*` | All page components |
| `frontend/src/components/` | Reusable components |
| `frontend/src/styles/` | CSS styling |
| `package.json` | Dependencies & scripts |

---

## ✨ Happy Navigating!

Your Hospital Navigation System is complete and ready to use.

Need help? Check the README.md or QUICKSTART.md files!

🏥 **Hospital Navigation System v1.0** ✅ **Ready**
