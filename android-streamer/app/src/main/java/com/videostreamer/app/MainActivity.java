package com.videostreamer.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONException;
import org.json.JSONObject;
import org.webrtc.AudioSource;
import org.webrtc.AudioTrack;
import org.webrtc.Camera1Enumerator;
import org.webrtc.Camera2Enumerator;
import org.webrtc.CameraEnumerator;
import org.webrtc.CameraVideoCapturer;
import org.webrtc.DataChannel;
import org.webrtc.EglBase;
import org.webrtc.IceCandidate;
import org.webrtc.MediaConstraints;
import org.webrtc.MediaStream;
import org.webrtc.PeerConnection;
import org.webrtc.PeerConnectionFactory;
import org.webrtc.RtpReceiver;
import org.webrtc.SdpObserver;
import org.webrtc.SessionDescription;
import org.webrtc.SurfaceTextureHelper;
import org.webrtc.SurfaceViewRenderer;
import org.webrtc.VideoCapturer;
import org.webrtc.VideoSource;
import org.webrtc.VideoTrack;

import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;

/**
 * MainActivity - Android Video Streamer
 *
 * This app captures camera feed and streams it to a PC via WebRTC.
 * It connects to your EasyRTC server using Socket.IO.
 */
public class MainActivity extends AppCompatActivity {

    private static final String TAG = "VideoStreamer";
    private static final int PERMISSION_REQUEST_CODE = 1001;

    // UI Elements
    private EditText serverUrlInput;
    private EditText roomIdInput;
    private Button connectButton;
    private Button disconnectButton;
    private Button switchCameraButton;
    private SurfaceViewRenderer localVideoView;
    private TextView statusText;

    // WebRTC Components
    private PeerConnectionFactory peerConnectionFactory;
    private PeerConnection peerConnection;
    private VideoTrack localVideoTrack;
    private AudioTrack localAudioTrack;
    private VideoCapturer videoCapturer;
    private EglBase rootEglBase;
    private SurfaceTextureHelper surfaceTextureHelper;

    // Socket.IO
    private Socket socket;
    private String myId;
    private String remoteId;

    // Camera
    private boolean usingFrontCamera = true;
    private boolean isConnected = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        initializeUI();
        checkPermissions();
    }

    /**
     * Initialize UI components
     */
    private void initializeUI() {
        serverUrlInput = findViewById(R.id.serverUrlInput);
        roomIdInput = findViewById(R.id.roomIdInput);
        connectButton = findViewById(R.id.connectButton);
        disconnectButton = findViewById(R.id.disconnectButton);
        switchCameraButton = findViewById(R.id.switchCameraButton);
        localVideoView = findViewById(R.id.localVideoView);
        statusText = findViewById(R.id.statusText);

        // Default server URL (change this to your server address)
        serverUrlInput.setText("http://YOUR_PC_IP:8080");
        roomIdInput.setText("stream-room");

        connectButton.setOnClickListener(v -> connectToServer());
        disconnectButton.setOnClickListener(v -> disconnect());
        switchCameraButton.setOnClickListener(v -> switchCamera());

        disconnectButton.setEnabled(false);
        switchCameraButton.setEnabled(false);
    }

    /**
     * Check and request necessary permissions
     */
    private void checkPermissions() {
        List<String> permissionsNeeded = new ArrayList<>();

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.CAMERA);
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            permissionsNeeded.add(Manifest.permission.RECORD_AUDIO);
        }

        if (!permissionsNeeded.isEmpty()) {
            ActivityCompat.requestPermissions(this,
                    permissionsNeeded.toArray(new String[0]),
                    PERMISSION_REQUEST_CODE);
        } else {
            initializeWebRTC();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == PERMISSION_REQUEST_CODE) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }

            if (allGranted) {
                initializeWebRTC();
            } else {
                Toast.makeText(this, "Permissions are required to use this app",
                        Toast.LENGTH_LONG).show();
                finish();
            }
        }
    }

    /**
     * Initialize WebRTC components
     */
    private void initializeWebRTC() {
        // Initialize PeerConnectionFactory
        PeerConnectionFactory.InitializationOptions initializationOptions =
                PeerConnectionFactory.InitializationOptions.builder(this)
                        .setEnableInternalTracer(true)
                        .createInitializationOptions();
        PeerConnectionFactory.initialize(initializationOptions);

        // Create EglBase for video rendering
        rootEglBase = EglBase.create();

        // Setup local video view
        localVideoView.init(rootEglBase.getEglBaseContext(), null);
        localVideoView.setMirror(true);
        localVideoView.setEnableHardwareScaler(true);

        // Build PeerConnectionFactory
        PeerConnectionFactory.Options options = new PeerConnectionFactory.Options();
        peerConnectionFactory = PeerConnectionFactory.builder()
                .setOptions(options)
                .createPeerConnectionFactory();

        // Create video source and track
        createVideoTrack();
        createAudioTrack();

        updateStatus("WebRTC initialized");
    }

    /**
     * Create video track from camera
     */
    private void createVideoTrack() {
        videoCapturer = createCameraCapturer(usingFrontCamera);

        VideoSource videoSource = peerConnectionFactory.createVideoSource(
                videoCapturer.isScreencast());

        surfaceTextureHelper = SurfaceTextureHelper.create(
                "CaptureThread", rootEglBase.getEglBaseContext());

        videoCapturer.initialize(surfaceTextureHelper,
                getApplicationContext(), videoSource.getCapturerObserver());

        videoCapturer.startCapture(1280, 720, 30);

        localVideoTrack = peerConnectionFactory.createVideoTrack("video1", videoSource);
        localVideoTrack.addSink(localVideoView);
        localVideoTrack.setEnabled(true);
    }

    /**
     * Create audio track from microphone
     */
    private void createAudioTrack() {
        AudioSource audioSource = peerConnectionFactory.createAudioSource(
                new MediaConstraints());
        localAudioTrack = peerConnectionFactory.createAudioTrack("audio1", audioSource);
        localAudioTrack.setEnabled(true);
    }

    /**
     * Create camera capturer
     */
    private VideoCapturer createCameraCapturer(boolean useFrontCamera) {
        CameraEnumerator enumerator;

        if (Camera2Enumerator.isSupported(this)) {
            enumerator = new Camera2Enumerator(this);
        } else {
            enumerator = new Camera1Enumerator(true);
        }

        String[] deviceNames = enumerator.getDeviceNames();

        // Try to find front/back camera
        for (String deviceName : deviceNames) {
            if (useFrontCamera && enumerator.isFrontFacing(deviceName)) {
                return enumerator.createCapturer(deviceName, null);
            } else if (!useFrontCamera && enumerator.isBackFacing(deviceName)) {
                return enumerator.createCapturer(deviceName, null);
            }
        }

        // Return first available camera
        return enumerator.createCapturer(deviceNames[0], null);
    }

    /**
     * Switch between front and back camera
     */
    private void switchCamera() {
        if (videoCapturer != null && videoCapturer instanceof CameraVideoCapturer) {
            CameraVideoCapturer cameraVideoCapturer = (CameraVideoCapturer) videoCapturer;
            cameraVideoCapturer.switchCamera(new CameraVideoCapturer.CameraSwitchHandler() {
                @Override
                public void onCameraSwitchDone(boolean isFrontCamera) {
                    usingFrontCamera = isFrontCamera;
                    localVideoView.setMirror(isFrontCamera);
                    updateStatus("Switched to " + (isFrontCamera ? "front" : "back") + " camera");
                }

                @Override
                public void onCameraSwitchError(String errorDescription) {
                    Log.e(TAG, "Camera switch error: " + errorDescription);
                    updateStatus("Camera switch failed");
                }
            });
        }
    }

    /**
     * Connect to signaling server
     */
    private void connectToServer() {
        String serverUrl = serverUrlInput.getText().toString().trim();
        String roomId = roomIdInput.getText().toString().trim();

        if (serverUrl.isEmpty()) {
            Toast.makeText(this, "Please enter server URL", Toast.LENGTH_SHORT).show();
            return;
        }

        updateStatus("Connecting to server...");

        try {
            socket = IO.socket(serverUrl);

            socket.on(Socket.EVENT_CONNECT, onConnect);
            socket.on(Socket.EVENT_DISCONNECT, onDisconnect);
            socket.on(Socket.EVENT_CONNECT_ERROR, onConnectError);
            socket.on("easyrtc_authenticated", onAuthenticated);
            socket.on("easyrtcMsg", onEasyRTCMessage);

            socket.connect();

        } catch (URISyntaxException e) {
            Log.e(TAG, "Socket connection error", e);
            updateStatus("Connection failed: Invalid URL");
        }
    }

    /**
     * Socket.IO Event Listeners
     */
    private Emitter.Listener onConnect = args -> runOnUiThread(() -> {
        Log.d(TAG, "Connected to server");
        updateStatus("Connected to server");

        // Authenticate with EasyRTC
        try {
            JSONObject authMsg = new JSONObject();
            authMsg.put("msgType", "authenticate");

            JSONObject msgData = new JSONObject();
            msgData.put("apiVersion", "1.0.0");
            msgData.put("applicationName", "default");

            authMsg.put("msgData", msgData);

            socket.emit("easyrtcAuth", authMsg);

        } catch (JSONException e) {
            Log.e(TAG, "Authentication error", e);
        }
    });

    private Emitter.Listener onAuthenticated = args -> runOnUiThread(() -> {
        try {
            JSONObject data = (JSONObject) args[0];
            myId = data.getJSONObject("msgData").getString("easyrtcid");

            Log.d(TAG, "Authenticated with ID: " + myId);
            updateStatus("Ready to stream! ID: " + myId);

            isConnected = true;
            connectButton.setEnabled(false);
            disconnectButton.setEnabled(true);
            switchCameraButton.setEnabled(true);

            // Wait for PC viewer to connect

        } catch (JSONException e) {
            Log.e(TAG, "Parse authenticated error", e);
        }
    });

    private Emitter.Listener onEasyRTCMessage = args -> {
        try {
            JSONObject msg = (JSONObject) args[0];
            String msgType = msg.getString("msgType");

            Log.d(TAG, "Received message: " + msgType);

            if (msgType.equals("offer")) {
                handleOffer(msg);
            } else if (msgType.equals("candidate")) {
                handleCandidate(msg);
            }

        } catch (JSONException e) {
            Log.e(TAG, "Parse message error", e);
        }
    };

    private Emitter.Listener onDisconnect = args -> runOnUiThread(() -> {
        Log.d(TAG, "Disconnected from server");
        updateStatus("Disconnected");
        resetConnection();
    });

    private Emitter.Listener onConnectError = args -> runOnUiThread(() -> {
        Log.e(TAG, "Connection error: " + args[0]);
        updateStatus("Connection error");
    });

    /**
     * Handle incoming WebRTC offer from PC viewer
     */
    private void handleOffer(JSONObject msg) throws JSONException {
        JSONObject msgData = msg.getJSONObject("msgData");
        String senderId = msg.getString("senderId");
        remoteId = senderId;

        String sdpType = msgData.getJSONObject("actualData").getString("type");
        String sdp = msgData.getJSONObject("actualData").getString("sdp");

        SessionDescription remoteSdp = new SessionDescription(
                SessionDescription.Type.OFFER, sdp);

        runOnUiThread(() -> {
            createPeerConnection();

            peerConnection.setRemoteDescription(new SdpObserver() {
                @Override
                public void onCreateSuccess(SessionDescription sessionDescription) {}

                @Override
                public void onSetSuccess() {
                    Log.d(TAG, "Remote description set successfully");
                    createAnswer();
                }

                @Override
                public void onCreateFailure(String s) {
                    Log.e(TAG, "Create failure: " + s);
                }

                @Override
                public void onSetFailure(String s) {
                    Log.e(TAG, "Set remote description failure: " + s);
                }
            }, remoteSdp);
        });
    }

    /**
     * Handle incoming ICE candidate
     */
    private void handleCandidate(JSONObject msg) throws JSONException {
        JSONObject msgData = msg.getJSONObject("msgData");
        JSONObject candidateData = msgData.getJSONObject("actualData");

        String sdpMid = candidateData.getString("id");
        int sdpMLineIndex = candidateData.getInt("label");
        String sdp = candidateData.getString("candidate");

        IceCandidate iceCandidate = new IceCandidate(sdpMid, sdpMLineIndex, sdp);

        if (peerConnection != null) {
            peerConnection.addIceCandidate(iceCandidate);
        }
    }

    /**
     * Create PeerConnection
     */
    private void createPeerConnection() {
        List<PeerConnection.IceServer> iceServers = new ArrayList<>();
        iceServers.add(PeerConnection.IceServer.builder("stun:stun.l.google.com:19302")
                .createIceServer());
        iceServers.add(PeerConnection.IceServer.builder("stun:stun1.l.google.com:19302")
                .createIceServer());

        PeerConnection.RTCConfiguration rtcConfig = new PeerConnection.RTCConfiguration(iceServers);
        rtcConfig.tcpCandidatePolicy = PeerConnection.TcpCandidatePolicy.DISABLED;
        rtcConfig.bundlePolicy = PeerConnection.BundlePolicy.MAXBUNDLE;
        rtcConfig.rtcpMuxPolicy = PeerConnection.RtcpMuxPolicy.REQUIRE;

        peerConnection = peerConnectionFactory.createPeerConnection(rtcConfig, new PeerConnection.Observer() {
            @Override
            public void onSignalingChange(PeerConnection.SignalingState signalingState) {
                Log.d(TAG, "Signaling state: " + signalingState);
            }

            @Override
            public void onIceConnectionChange(PeerConnection.IceConnectionState iceConnectionState) {
                Log.d(TAG, "ICE connection state: " + iceConnectionState);
                runOnUiThread(() -> updateStatus("ICE: " + iceConnectionState));
            }

            @Override
            public void onIceConnectionReceivingChange(boolean b) {}

            @Override
            public void onIceGatheringChange(PeerConnection.IceGatheringState iceGatheringState) {
                Log.d(TAG, "ICE gathering state: " + iceGatheringState);
            }

            @Override
            public void onIceCandidate(IceCandidate iceCandidate) {
                sendIceCandidate(iceCandidate);
            }

            @Override
            public void onIceCandidatesRemoved(IceCandidate[] iceCandidates) {}

            @Override
            public void onAddStream(MediaStream mediaStream) {}

            @Override
            public void onRemoveStream(MediaStream mediaStream) {}

            @Override
            public void onDataChannel(DataChannel dataChannel) {}

            @Override
            public void onRenegotiationNeeded() {
                Log.d(TAG, "Renegotiation needed");
            }

            @Override
            public void onAddTrack(RtpReceiver rtpReceiver, MediaStream[] mediaStreams) {}
        });

        // Add local tracks to peer connection
        MediaStream mediaStream = peerConnectionFactory.createLocalMediaStream("local_stream");
        mediaStream.addTrack(localVideoTrack);
        mediaStream.addTrack(localAudioTrack);
        peerConnection.addStream(mediaStream);
    }

    /**
     * Create answer to offer
     */
    private void createAnswer() {
        MediaConstraints constraints = new MediaConstraints();
        constraints.mandatory.add(new MediaConstraints.KeyValuePair("OfferToReceiveAudio", "false"));
        constraints.mandatory.add(new MediaConstraints.KeyValuePair("OfferToReceiveVideo", "false"));

        peerConnection.createAnswer(new SdpObserver() {
            @Override
            public void onCreateSuccess(SessionDescription sessionDescription) {
                peerConnection.setLocalDescription(new SdpObserver() {
                    @Override
                    public void onCreateSuccess(SessionDescription sessionDescription) {}

                    @Override
                    public void onSetSuccess() {
                        sendAnswer(sessionDescription);
                    }

                    @Override
                    public void onCreateFailure(String s) {}

                    @Override
                    public void onSetFailure(String s) {
                        Log.e(TAG, "Set local description failure: " + s);
                    }
                }, sessionDescription);
            }

            @Override
            public void onSetSuccess() {}

            @Override
            public void onCreateFailure(String s) {
                Log.e(TAG, "Create answer failure: " + s);
            }

            @Override
            public void onSetFailure(String s) {}
        }, constraints);
    }

    /**
     * Send answer to PC viewer
     */
    private void sendAnswer(SessionDescription answer) {
        try {
            JSONObject msg = new JSONObject();
            msg.put("msgType", "answer");
            msg.put("targetId", remoteId);

            JSONObject msgData = new JSONObject();
            JSONObject actualData = new JSONObject();
            actualData.put("type", answer.type.canonicalForm());
            actualData.put("sdp", answer.description);

            msgData.put("actualData", actualData);
            msg.put("msgData", msgData);

            socket.emit("easyrtcMsg", msg);

            Log.d(TAG, "Answer sent");
            updateStatus("Streaming to PC...");

        } catch (JSONException e) {
            Log.e(TAG, "Send answer error", e);
        }
    }

    /**
     * Send ICE candidate to PC viewer
     */
    private void sendIceCandidate(IceCandidate candidate) {
        try {
            JSONObject msg = new JSONObject();
            msg.put("msgType", "candidate");
            msg.put("targetId", remoteId);

            JSONObject msgData = new JSONObject();
            JSONObject actualData = new JSONObject();
            actualData.put("type", "candidate");
            actualData.put("id", candidate.sdpMid);
            actualData.put("label", candidate.sdpMLineIndex);
            actualData.put("candidate", candidate.sdp);

            msgData.put("actualData", actualData);
            msg.put("msgData", msgData);

            socket.emit("easyrtcMsg", msg);

            Log.d(TAG, "ICE candidate sent");

        } catch (JSONException e) {
            Log.e(TAG, "Send ICE candidate error", e);
        }
    }

    /**
     * Disconnect from server and cleanup
     */
    private void disconnect() {
        if (socket != null) {
            socket.disconnect();
            socket.off();
        }

        resetConnection();
        updateStatus("Disconnected");
    }

    /**
     * Reset connection state
     */
    private void resetConnection() {
        if (peerConnection != null) {
            peerConnection.close();
            peerConnection = null;
        }

        isConnected = false;
        remoteId = null;
        myId = null;

        runOnUiThread(() -> {
            connectButton.setEnabled(true);
            disconnectButton.setEnabled(false);
            switchCameraButton.setEnabled(false);
        });
    }

    /**
     * Update status text
     */
    private void updateStatus(String status) {
        runOnUiThread(() -> {
            statusText.setText("Status: " + status);
            Log.d(TAG, status);
        });
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (videoCapturer != null) {
            try {
                videoCapturer.stopCapture();
            } catch (InterruptedException e) {
                Log.e(TAG, "Stop capture error", e);
            }
        }

        if (surfaceTextureHelper != null) {
            surfaceTextureHelper.dispose();
        }

        if (localVideoView != null) {
            localVideoView.release();
        }

        if (rootEglBase != null) {
            rootEglBase.release();
        }

        disconnect();
    }
}
