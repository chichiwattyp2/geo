# 📱➡️💻 Android to PC Video Streaming Setup Guide

## 🎯 Overview

This solution allows you to stream video from your Android device's camera to your PC in real-time using WebRTC technology. The system consists of:

1. **Android App** - Captures camera feed and streams it
2. **Node.js Server** - Handles signaling and WebRTC connections
3. **PC Web Viewer** - Displays the live video stream in your browser

---

## 🏗️ Architecture

```
┌─────────────┐         WebRTC/Socket.IO        ┌─────────────┐
│   Android   │ ◄───────────────────────────► │   Server    │
│     App     │         Video Stream            │  (Node.js)  │
└─────────────┘                                 └─────────────┘
                                                       ▲
                                                       │
                                                       │ WebSocket
                                                       │
                                                       ▼
                                                ┌─────────────┐
                                                │  PC Viewer  │
                                                │ (Browser)   │
                                                └─────────────┘
```

---

## 📋 Prerequisites

### For the Server (PC):
- **Node.js** installed (version 12 or higher)
- **Network connection** (same network as Android device)
- **Port 8080** open and available

### For Android Development:
- **Android Studio** (latest version)
- **Android device** running Android 5.0 (API 21) or higher
- **USB cable** for debugging (or wireless debugging)

### For PC Viewing:
- Modern web browser (Chrome, Edge, Firefox, Safari)

---

## 🚀 Setup Instructions

### Step 1: Start the Server

1. Open terminal/command prompt in the project directory
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. You should see:
   ```
   listening on http://localhost:8080
   ```

5. **Find your PC's IP address:**

   **Windows:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

   **Mac/Linux:**
   ```bash
   ifconfig
   ```
   Look for "inet" address (e.g., 192.168.1.100)

   **Note:** Use your **local network IP** (starts with 192.168.x.x or 10.x.x.x), not 127.0.0.1

---

### Step 2: Build the Android App

1. **Open Android Studio**

2. **Import the project:**
   - File → Open
   - Navigate to `android-streamer` folder
   - Click "OK"

3. **Wait for Gradle sync** to complete

4. **Connect your Android device:**
   - Enable "Developer Options" on your phone
   - Enable "USB Debugging"
   - Connect via USB cable
   - Accept debugging permission on phone

5. **Build and install:**
   - Click the green "Run" button (▶️) in Android Studio
   - Select your device
   - Wait for installation to complete

**Alternative: Build APK manually**
```bash
cd android-streamer
./gradlew assembleDebug
```
APK will be in: `app/build/outputs/apk/debug/app-debug.apk`

---

### Step 3: Open PC Viewer

1. **In your web browser, navigate to:**
   ```
   http://localhost:8080/android-stream-viewer.html
   ```

2. **Click "Start Viewer"**

3. **Note your Viewer ID** (displayed in purple box)
   - Example: `easyrtcid_ABC123`

4. **Keep this page open!**

---

### Step 4: Connect Android App

1. **Open the app** on your Android device

2. **Enter Server URL:**
   ```
   http://YOUR_PC_IP:8080
   ```
   Replace `YOUR_PC_IP` with the IP address from Step 1

   Example: `http://192.168.1.100:8080`

3. **Enter Room ID:**
   ```
   stream-room
   ```
   (or any name you prefer)

4. **Grant Permissions:**
   - Allow camera access
   - Allow microphone access

5. **Click "Connect"**

6. **Wait for connection:**
   - Status will change to "Ready to stream!"
   - The PC viewer should automatically detect your Android device

---

## 🎥 Using the Stream

### Android App Features:

- **🎬 Camera Preview:** See what you're streaming in real-time
- **🔄 Switch Camera:** Toggle between front and back camera
- **📊 Status Display:** See connection status and stream info
- **❌ Disconnect:** Stop streaming and close connection

### PC Viewer Features:

- **📺 Live Video:** See the Android camera feed in real-time
- **📊 Statistics:** View connection state, ICE state, and data received
- **🔍 Full Screen:** Click on video to expand
- **📱 Auto-reconnect:** Automatically reconnects if connection drops

---

## 🔧 Troubleshooting

### ❌ "Can't connect to server"

**Problem:** Android app can't reach the server

**Solutions:**
1. **Check IP address:**
   - Make sure you're using the correct local IP
   - Don't use `localhost` or `127.0.0.1`

2. **Same network:**
   - Ensure Android device and PC are on same WiFi network
   - Disable VPNs on both devices

3. **Firewall:**
   - Allow port 8080 through firewall:
     - **Windows:** Windows Defender Firewall → Advanced Settings → Inbound Rules → New Rule → Port → 8080
     - **Mac:** System Preferences → Security & Privacy → Firewall Options
     - **Linux:** `sudo ufw allow 8080`

4. **Server running:**
   - Check terminal to confirm server is running
   - Look for "listening on http://localhost:8080"

---

### ❌ "Connection successful but no video"

**Problem:** Connected but video not showing

**Solutions:**
1. **Permissions:**
   - Verify camera permission was granted on Android
   - Settings → Apps → Video Streamer → Permissions

2. **Camera in use:**
   - Close other apps using the camera
   - Restart the Android app

3. **Browser support:**
   - Use Chrome, Edge, or Firefox
   - Enable WebRTC in browser settings

4. **Check console:**
   - Open browser DevTools (F12)
   - Look for errors in Console tab

---

### ❌ "Video is laggy or stuttering"

**Problem:** Poor video quality or lag

**Solutions:**
1. **Network:**
   - Use 5GHz WiFi instead of 2.4GHz
   - Move closer to WiFi router
   - Reduce network traffic

2. **Resolution:**
   - Modify MainActivity.java line with `startCapture()`:
   ```java
   // Lower resolution for better performance
   videoCapturer.startCapture(640, 480, 24); // Instead of 1280x720x30
   ```

3. **Device performance:**
   - Close other apps on Android
   - Ensure device is not overheating

---

### ❌ "WebRTC not working"

**Problem:** ICE connection failing

**Solutions:**
1. **STUN servers:**
   - The app uses Google's public STUN servers
   - If blocked, add your own TURN server

2. **Network restrictions:**
   - Some corporate/school networks block WebRTC
   - Try a different network

3. **Router settings:**
   - Enable UPnP in router settings
   - Forward port 8080 if needed

---

## ⚙️ Configuration Options

### Modify Video Quality (Android)

In `MainActivity.java`, find:
```java
videoCapturer.startCapture(1280, 720, 30);
```

Change to:
- **High Quality:** `1920, 1080, 30`
- **Medium Quality:** `1280, 720, 30` (default)
- **Low Quality:** `640, 480, 24`
- **Very Low Quality:** `320, 240, 15`

### Change Server Port

1. **In `server.js`:**
```javascript
var port = process.env.PORT || 8080; // Change 8080 to your port
```

2. **Update Android app** to use new port:
```
http://YOUR_PC_IP:NEW_PORT
```

### Add TURN Server (for restricted networks)

In `MainActivity.java`, add to `iceServers` list:
```java
iceServers.add(PeerConnection.IceServer.builder("turn:your-turn-server.com:3478")
    .setUsername("username")
    .setPassword("password")
    .createIceServer());
```

In `android-stream-viewer.html`, add to `iceServers`:
```javascript
{
    urls: 'turn:your-turn-server.com:3478',
    username: 'username',
    credential: 'password'
}
```

---

## 📱 Android App Project Structure

```
android-streamer/
├── AndroidManifest.xml                    # App permissions and configuration
├── app/
│   ├── build.gradle                       # Dependencies and build config
│   └── src/
│       └── main/
│           ├── java/com/videostreamer/app/
│           │   └── MainActivity.java       # Main application logic
│           └── res/
│               ├── layout/
│               │   └── activity_main.xml   # UI layout
│               └── drawable/
│                   ├── button_connect.xml  # Button styles
│                   ├── button_disconnect.xml
│                   ├── button_switch.xml
│                   ├── input_background.xml
│                   └── status_background.xml
├── build.gradle                           # Project-level build config
└── settings.gradle                        # Project settings
```

---

## 🌐 Web Viewer Files

```
public/
└── android-stream-viewer.html             # PC viewer interface
```

---

## 🔐 Security Considerations

1. **Local Network Only:**
   - This setup is designed for local network use
   - Do not expose directly to the internet

2. **HTTPS:**
   - For production, use HTTPS/WSS
   - Add SSL certificate to server

3. **Authentication:**
   - Consider adding user authentication
   - Implement room passwords

4. **Permissions:**
   - Android app requests camera/microphone permissions
   - Users must explicitly grant access

---

## 🚀 Advanced Features (Optional)

### Add Audio Streaming

Already included! The Android app streams both video and audio.

### Record Stream on PC

Add to `android-stream-viewer.html`:
```javascript
let mediaRecorder;
let recordedChunks = [];

function startRecording() {
    const stream = remoteVideo.srcObject;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.start();
}

function stopRecording() {
    mediaRecorder.stop();
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stream-recording.webm';
    a.click();
}
```

### Multiple Viewers

The current setup supports one Android streaming to one PC. To support multiple viewers:

1. Modify server to handle multiple peer connections
2. Broadcast stream to all connected viewers
3. Update Android app to manage multiple peer connections

---

## 📊 Performance Tips

### For Best Quality:

1. **Use 5GHz WiFi** instead of 2.4GHz
2. **Keep devices close to router**
3. **Reduce background network traffic**
4. **Use high-end Android device** (better camera & processor)
5. **Close unnecessary apps** on both devices
6. **Use wired connection for PC** if possible

### For Low Bandwidth:

1. **Reduce video resolution** (640x480 or lower)
2. **Lower frame rate** (15-20 fps)
3. **Disable audio** if not needed
4. **Use hardware encoding** (already enabled)

---

## 🆘 Getting Help

### Check Logs:

**Server:**
```bash
# Server logs in terminal
```

**Android:**
```bash
# Android Studio → Logcat
# Filter by tag: "VideoStreamer"
```

**PC Viewer:**
```javascript
// Browser DevTools → Console (F12)
```

### Common Log Messages:

- ✅ `"Connected to server"` - Socket.IO connected
- ✅ `"Authenticated with ID"` - EasyRTC authenticated
- ✅ `"ICE connection state: connected"` - WebRTC connected
- ✅ `"Received remote track"` - Video stream received
- ❌ `"Connection error"` - Check network/firewall
- ❌ `"Camera permission denied"` - Grant permissions

---

## 🎓 How It Works

### 1. Signaling (Socket.IO + EasyRTC)

- Android app connects to server via Socket.IO
- PC viewer connects to same server
- Server facilitates exchange of WebRTC offers/answers
- ICE candidates exchanged for NAT traversal

### 2. Media Streaming (WebRTC)

- Android captures camera feed using WebRTC API
- Video/audio encoded using device hardware
- Encrypted peer-to-peer stream sent to PC
- PC decodes and displays in browser

### 3. Connection Flow

```
1. Server starts listening on port 8080
2. PC Viewer opens browser → connects to server → gets Viewer ID
3. Android app → connects to server → gets Android ID
4. Android creates offer with video/audio tracks
5. Server forwards offer to PC Viewer
6. PC Viewer creates answer
7. Server forwards answer to Android
8. ICE candidates exchanged → P2P connection established
9. Video stream flows from Android to PC
```

---

## 📝 Notes

- **Latency:** Typically 100-300ms depending on network
- **Quality:** Up to 1080p @ 30fps (device dependent)
- **Codec:** VP8/VP9 for video, Opus for audio
- **Browser:** Chrome/Edge recommended for best performance
- **Android:** Minimum API 21 (Lollipop 5.0)

---

## 🎉 Success!

If everything is working, you should see:
- ✅ Android app showing "Streaming to PC..."
- ✅ PC viewer showing live video feed
- ✅ Smooth video playback
- ✅ Low latency (< 500ms)

---

## 📄 License

MIT License - Free to use and modify!

---

## 🤝 Contributing

Feel free to:
- Add new features
- Improve video quality
- Add recording capabilities
- Enhance UI/UX
- Fix bugs

---

## 🔗 Useful Resources

- [WebRTC Documentation](https://webrtc.org/)
- [Socket.IO Documentation](https://socket.io/docs/)
- [EasyRTC Documentation](https://easyrtc.com/)
- [Android WebRTC](https://webrtc.github.io/webrtc-org/native-code/android/)

---

**Happy Streaming! 🎥📱➡️💻**
