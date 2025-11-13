# 📱 Android Video Streamer App

Stream your Android camera to PC in real-time using WebRTC!

## ✨ Features

- 📹 Real-time video streaming from Android to PC
- 🎤 Audio streaming included
- 🔄 Switch between front and back camera
- 📊 Connection status monitoring
- 🚀 Low latency (< 500ms)
- 🔒 Secure WebRTC connection

## 🏗️ Build Requirements

- Android Studio Arctic Fox or later
- Gradle 7.5+
- Android SDK 21+ (Lollipop 5.0)
- Java 8+

## 📦 Dependencies

- WebRTC: `org.webrtc:google-webrtc:1.0.32006`
- Socket.IO: `io.socket:socket.io-client:2.1.0`
- AndroidX libraries

## 🚀 Quick Build

1. **Open in Android Studio:**
   ```
   File → Open → Select 'android-streamer' folder
   ```

2. **Sync Gradle:**
   - Wait for automatic Gradle sync
   - Or: File → Sync Project with Gradle Files

3. **Connect Device:**
   - Enable USB Debugging on Android device
   - Connect via USB
   - Authorize computer on device

4. **Build & Run:**
   - Click green ▶️ button
   - Or: Run → Run 'app'
   - Or: `./gradlew installDebug`

## 🛠️ Manual Build

```bash
# Debug build
./gradlew assembleDebug

# Release build (unsigned)
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug

# Clean build
./gradlew clean build
```

**Output APK location:**
- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release-unsigned.apk`

## 📱 App Permissions

The app requests:
- `CAMERA` - Capture video from camera
- `RECORD_AUDIO` - Capture audio from microphone
- `INTERNET` - Connect to streaming server
- `ACCESS_NETWORK_STATE` - Check network status

All permissions are requested at runtime.

## ⚙️ Configuration

### Change Video Quality

In `MainActivity.java`, line ~200:
```java
// Current: 1280x720 @ 30fps
videoCapturer.startCapture(1280, 720, 30);

// Options:
// High:   videoCapturer.startCapture(1920, 1080, 30);
// Medium: videoCapturer.startCapture(1280, 720, 30);
// Low:    videoCapturer.startCapture(640, 480, 24);
```

### Change Server URL

Default server URL can be set in `MainActivity.java`, line ~95:
```java
serverUrlInput.setText("http://YOUR_PC_IP:8080");
```

## 🐛 Debugging

### View Logs

In Android Studio:
1. View → Tool Windows → Logcat
2. Filter by tag: `VideoStreamer`

Common log tags:
- `VideoStreamer` - Main app logs
- `MainActivity` - Activity lifecycle
- `WebRTC` - WebRTC internal logs

### Enable Verbose Logging

In `MainActivity.java`:
```java
private static final String TAG = "VideoStreamer";
Log.v(TAG, "Your debug message");
```

## 🔧 Troubleshooting

### Build Errors

**"Cannot resolve symbol 'webrtc'"**
- Sync Gradle: File → Sync Project with Gradle Files
- Invalidate caches: File → Invalidate Caches / Restart

**"Gradle sync failed"**
- Check internet connection
- Update Android Studio
- Check `build.gradle` dependencies

### Runtime Errors

**"Camera permission denied"**
- Uninstall app
- Reinstall and grant permissions

**"Cannot connect to server"**
- Check server is running
- Verify IP address is correct
- Ensure devices on same network

## 📂 Project Structure

```
android-streamer/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/videostreamer/app/
│   │       │   └── MainActivity.java       # Main logic
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml   # UI layout
│   │       │   └── drawable/               # UI resources
│   │       └── AndroidManifest.xml         # Permissions
│   └── build.gradle                        # App dependencies
├── build.gradle                            # Project config
├── settings.gradle                         # Project settings
└── gradle/
    └── wrapper/
        └── gradle-wrapper.properties       # Gradle version
```

## 🎨 Customization

### Change App Icon

Replace files in:
- `app/src/main/res/mipmap-hdpi/ic_launcher.png`
- `app/src/main/res/mipmap-mdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xhdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
- `app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

### Change App Name

In `AndroidManifest.xml`:
```xml
<application
    android:label="Your App Name"
    ...>
```

### Change Theme

In `AndroidManifest.xml`:
```xml
<application
    android:theme="@style/Theme.AppCompat.Light.DarkActionBar"
    ...>
```

Options:
- `Theme.AppCompat.Light`
- `Theme.AppCompat.Light.DarkActionBar`
- `Theme.AppCompat`

## 📊 Performance

- **Video Quality:** Up to 1080p @ 30fps
- **Audio Quality:** Opus codec, 48kHz
- **Latency:** 100-300ms (network dependent)
- **CPU Usage:** Hardware encoding used when available
- **Battery:** Moderate (camera + networking)

## 🔐 Security Notes

- Uses encrypted WebRTC connections
- STUN servers for NAT traversal
- No data stored on server
- Peer-to-peer streaming when possible

## 📄 License

MIT License - Free to use and modify

## 🔗 Resources

- [Full Documentation](../ANDROID_VIDEO_STREAMING_GUIDE.md)
- [Quick Start](./QUICK_START.md)
- [WebRTC Android Docs](https://webrtc.github.io/webrtc-org/native-code/android/)

## 🆘 Need Help?

1. Check [Full Guide](../ANDROID_VIDEO_STREAMING_GUIDE.md)
2. Review [Troubleshooting Section](../ANDROID_VIDEO_STREAMING_GUIDE.md#-troubleshooting)
3. Check Logcat for errors
4. Verify network configuration

---

**Happy Streaming! 📱➡️💻**
