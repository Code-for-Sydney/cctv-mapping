# NSW CCTV Mapping

An interactive mapping application that displays various types of NSW cameras (live traffic, street safety, fixed speed, red light speed, mobile speed, and maritime cameras) on interactive maps. For live cameras, users can tap markers to view real-time snapshot images.

## Features

- **Interactive Maps**: Full-screen maps centered on Sydney Metro area with camera markers
- **Live Camera Feeds**: Tap live camera markers to view real-time JPEG snapshots that auto-refresh
- **Static Camera Locations**: View locations and details for safety and speed cameras
- **Multiple Platforms**: Native Android app + Web applications (Leaflet and MapLibre implementations)
- **Offline Support**: Local data caching for static camera information
- **Search & Filter**: Find cameras by name, type, or location

## Platforms

### Android App
- Built with Kotlin, Jetpack Compose, and OSMDroid
- Supports Android 8.0+ (API 26)
- Material Design 3 with dynamic theming

### Web (Leaflet)
- React + TypeScript application using Leaflet maps
- Modern web technologies with responsive design

### Web-App (MapLibre)
- React + TypeScript application using MapLibre GL JS
- Alternative map implementation for comparison

## Prerequisites

- **Android**: Android Studio Arctic Fox or later, JDK 11+
- **Web**: Node.js 16+, npm or yarn
- **Web-App**: Node.js 16+, npm or yarn

## Installation & Setup

### Android App

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/nsw-cctv-mapping.git
   cd nsw-cctv-mapping
   ```

2. **Open in Android Studio:**
   - Launch Android Studio
   - Select "Open" and navigate to the `android/` directory
   - Click "OK" to open the project

3. **Sync Gradle Files:**
   - Android Studio should automatically prompt to sync Gradle files
   - If not, go to File → Sync Project with Gradle Files
   - Wait for the sync to complete (this downloads dependencies)

4. **Configure SDK and Build Tools:**
   - Ensure you have Android SDK API 26+ installed
   - Go to File → Project Structure → SDK Location
   - Verify JDK location (JDK 11+ required)

5. **Build the Project:**
   - Go to Build → Make Project (or Ctrl+F9)
   - Alternatively, use the hammer icon in the toolbar
   - Check for any build errors in the Build window

6. **Run on Device or Emulator:**

   **Option A: Android Emulator**
   - Go to Tools → Device Manager
   - Create a new Virtual Device or select existing
   - Click the "Run" button (green play icon) or Shift+F10
   - Select your emulator from the deployment target dialog

   **Option B: Physical Device**
   - Enable Developer Options on your Android device:
     - Go to Settings → About Phone → Tap "Build Number" 7 times
     - Go back to Settings → Developer Options
     - Enable "USB Debugging"
   - Connect your device via USB
   - Go to Run → Run 'app' or click the green play button
   - Select your device from the deployment target dialog

7. **ADB Connection (for Physical Devices):**
   - Ensure ADB is installed (comes with Android SDK)
   - Connect device via USB
   - Verify connection:
     ```bash
     adb devices
     ```
     You should see your device listed
   - If device not recognized:
     - Try different USB cable/port
     - On Windows: Install OEM USB drivers
     - On macOS/Linux: May need to add udev rules
   - For wireless ADB:
     ```bash
     adb tcpip 5555
     adb connect <device-ip>:5555
     ```

8. **Troubleshooting:**
   - **Gradle sync fails:** Check internet connection, proxy settings, or try Invalidate Caches / Restart
   - **Build errors:** Ensure all dependencies are downloaded, check SDK versions
   - **Device not detected:** Restart ADB server (`adb kill-server && adb start-server`)
   - **App crashes:** Check device logs in Android Studio (Logcat tab)

#### Command-Line Development (Without Android Studio)

If you prefer not to use Android Studio, you can build and run the app using command-line tools:

1. **Install Android SDK:**
   - Download Android SDK Command-line tools from [developer.android.com](https://developer.android.com/studio#command-line-tools-only)
   - Extract to a directory (e.g., `~/Android/sdk`)
   - Set environment variables:
     ```bash
     export ANDROID_HOME=~/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
     ```

2. **Install Required SDK Components:**
   ```bash
   sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
   ```

3. **Navigate to Android Project:**
   ```bash
   cd android
   ```

4. **Build APK:**
   ```bash
   ./gradlew assembleDebug
   ```
   The APK will be generated at `app/build/outputs/apk/debug/app-debug.apk`

5. **Install on Device:**
   ```bash
   adb install app/build/outputs/apk/debug/app-debug.apk
   ```

6. **Run the App:**
   ```bash
   adb shell am start -n com.example.nswcctvmapping/.MainActivity
   ```
   (Replace with actual package name and activity)

7. **Uninstall App:**
   ```bash
   adb uninstall com.example.nswcctvmapping
   ```

8. **View Logs:**
   ```bash
   adb logcat
   ```

**Note:** While command-line development is possible, Android Studio provides a much better development experience with debugging, code completion, and visual tools. It's highly recommended for active development.

### Web (Leaflet)

1. Navigate to the web directory:
   ```bash
   cd web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

### Web-App (MapLibre)

1. Navigate to the web-app directory:
   ```bash
   cd web-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

## Data Sources

The application uses multiple data sources:

- **Live Traffic Cameras**: Fetched from NSW OpenData Soft API
- **Street Safety Cameras**: Local GeoJSON data
- **Fixed Speed Cameras**: Local CSV data
- **Red Light Speed Cameras**: Local CSV data
- **Mobile Speed Cameras**: Local CSV data
- **Maritime Web Cameras**: Local GeoJSON data

All static data files are located in the `data/` directory.

## Usage

### Android App
- Launch the app to view the map
- Tap camera markers to view details
- Use the location FAB to center on your current position
- Pull down to refresh data

### Web Applications
- Open the application in your browser
- Click camera markers to view details in a bottom sheet
- Use search to find specific cameras
- Live cameras show real-time images that refresh automatically

## Architecture

The project follows Clean Architecture principles:

- **Domain Layer**: Business logic and entities
- **Data Layer**: Remote API calls and local data storage
- **UI Layer**: Compose components for Android, React components for web

## Technologies Used

### Android
- Kotlin 1.9.x
- Jetpack Compose
- OSMDroid
- Hilt (Dependency Injection)
- Retrofit + OkHttp
- Room (Database)
- Coil (Image Loading)

### Web
- React 18
- TypeScript
- Leaflet / MapLibre GL JS
- Axios
- Vite (Build tool)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- NSW Government Open Data for camera location data
- Transport for NSW for live camera feeds
- OpenStreetMap contributors for map tiles</content>
<parameter name="filePath">/Volumes/BigSpace/Repos/maps_cameras/cctv-mapping/README.md