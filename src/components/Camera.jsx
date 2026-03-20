import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera as MediaPipeCamera } from '@mediapipe/camera_utils';
import useStore from '../store/useStore';
import { renderAllMakeup } from '../utils/makeupRenderer';

const Camera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const makeupCanvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);

  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);

  const {
    isCameraActive,
    setCameraActive,
    setFaceDetected,
    setFaceLandmarks,
    selectedProducts,
    selectedShades,
    makeupIntensity,
    isCompareMode,
    comparePosition,
  } = useStore();

  // Process face mesh results
  const onResults = useCallback((results) => {
    if (!canvasRef.current || !makeupCanvasRef.current) return;

    const canvas = canvasRef.current;
    const makeupCanvas = makeupCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const makeupCtx = makeupCanvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvases
    ctx.clearRect(0, 0, width, height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      setFaceDetected(true);
      setFaceLandmarks(landmarks);

      // Render makeup on the makeup canvas
      renderAllMakeup(
        makeupCtx,
        landmarks,
        width,
        height,
        selectedProducts,
        selectedShades,
        makeupIntensity
      );

      // Handle compare mode
      if (isCompareMode) {
        // Draw divider line
        ctx.beginPath();
        const dividerX = (comparePosition / 100) * width;
        ctx.moveTo(dividerX, 0);
        ctx.lineTo(dividerX, height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Clip makeup to right side only
        makeupCtx.save();
        makeupCtx.clearRect(0, 0, dividerX, height);
        makeupCtx.restore();
      }
    } else {
      setFaceDetected(false);
      setFaceLandmarks(null);
      makeupCtx.clearRect(0, 0, width, height);
    }
  }, [selectedProducts, selectedShades, makeupIntensity, isCompareMode, comparePosition, setFaceDetected, setFaceLandmarks]);

  // Initialize MediaPipe Face Mesh
  useEffect(() => {
    const initializeFaceMesh = async () => {
      try {
        setIsInitializing(true);
        setError(null);

        const faceMesh = new FaceMesh({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(onResults);
        faceMeshRef.current = faceMesh;

        // Start camera
        if (videoRef.current) {
          const camera = new MediaPipeCamera(videoRef.current, {
            onFrame: async () => {
              if (faceMeshRef.current && videoRef.current) {
                await faceMeshRef.current.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });

          await camera.start();
          cameraRef.current = camera;
          setCameraActive(true);
          setIsInitializing(false);
        }
      } catch (err) {
        console.error('Camera initialization error:', err);
        setError('Unable to access camera. Please ensure camera permissions are granted.');
        setIsInitializing(false);
      }
    };

    initializeFaceMesh();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (faceMeshRef.current) {
        faceMeshRef.current.close();
      }
    };
  }, [onResults, setCameraActive]);

  // Update face mesh callback when makeup changes
  useEffect(() => {
    if (faceMeshRef.current) {
      faceMeshRef.current.onResults(onResults);
    }
  }, [onResults]);

  // Handle canvas sizing
  useEffect(() => {
    const handleResize = () => {
      if (videoRef.current && canvasRef.current && makeupCanvasRef.current) {
        const video = videoRef.current;
        const container = video.parentElement;
        if (container) {
          const width = container.clientWidth;
          const height = container.clientHeight;

          canvasRef.current.width = width;
          canvasRef.current.height = height;
          makeupCanvasRef.current.width = width;
          makeupCanvasRef.current.height = height;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-900 rounded-3xl">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📷</div>
          <h3 className="text-white text-xl font-semibold mb-2">Camera Access Required</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-3xl bg-black">
      {/* Video element (hidden but captures camera) */}
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover transform scale-x-[-1]"
        playsInline
        muted
      />

      {/* Canvas for face mesh visualization (optional debug) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Canvas for makeup rendering */}
      <canvas
        ref={makeupCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Loading overlay */}
      {isInitializing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Initializing camera...</p>
            <p className="text-gray-400 text-sm mt-2">Please allow camera access when prompted</p>
          </div>
        </div>
      )}

      {/* Face detection indicator */}
      {!isInitializing && isCameraActive && (
        <div className="absolute top-4 left-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
            ${useStore.getState().isFaceDetected
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              useStore.getState().isFaceDetected ? 'bg-green-400' : 'bg-yellow-400 animate-pulse'
            }`} />
            {useStore.getState().isFaceDetected ? 'Face Detected' : 'Position your face'}
          </div>
        </div>
      )}

      {/* Compare mode indicator */}
      {isCompareMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-4 px-4 py-2 bg-black/60 backdrop-blur rounded-full text-white text-sm">
            <span>Before</span>
            <div className="w-px h-4 bg-white/50" />
            <span>After</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
