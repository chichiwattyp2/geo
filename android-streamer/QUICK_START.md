# 🚀 Quick Start Guide - Android Video Streaming

## ⚡ 3-Minute Setup

### 1️⃣ Start Server (PC)
```bash
cd /path/to/geo
npm install
npm start
```
**Get your PC's IP:** (don't use 127.0.0.1!)
- Windows: `ipconfig` → Look for IPv4
- Mac/Linux: `ifconfig` → Look for inet

Example: `192.168.1.100`

---

### 2️⃣ Build Android App
1. Open Android Studio
2. Open folder: `android-streamer`
3. Connect Android device via USB
4. Click ▶️ Run button
5. Grant camera permissions when prompted

---

### 3️⃣ Open PC Viewer
1. Browser → `http://localhost:8080/android-stream-viewer.html`
2. Click "Start Viewer"
3. Keep page open

---

### 4️⃣ Connect from Android
1. Open app on phone
2. Enter: `http://YOUR_PC_IP:8080` (e.g., `http://192.168.1.100:8080`)
3. Room ID: `stream-room`
4. Click "Connect"
5. **Done!** You should see live video on PC

---

## 🔧 Troubleshooting

### Can't Connect?
✅ Both devices on same WiFi network
✅ Used local IP (192.168.x.x), not localhost
✅ Port 8080 allowed in firewall
✅ Server is running (check terminal)

### No Video?
✅ Camera permission granted on Android
✅ Using Chrome/Edge browser
✅ Check browser console (F12) for errors

---

## 📝 Important URLs

- **Server:** `http://YOUR_PC_IP:8080`
- **PC Viewer:** `http://localhost:8080/android-stream-viewer.html`
- **Documentation:** See `ANDROID_VIDEO_STREAMING_GUIDE.md`

---

## 🎮 Controls

**Android App:**
- 🔄 Switch Camera button
- ❌ Disconnect button

**PC Viewer:**
- Automatically connects when Android streams
- Shows connection stats and video quality

---

**Full documentation:** `ANDROID_VIDEO_STREAMING_GUIDE.md`
