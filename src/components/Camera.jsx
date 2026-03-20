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
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
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
      <div className="relative w-full h-full flex items-center justify-center bg-charcoal rounded-2xl">
        <div className="text-center p-8 max-w-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-white text-lg font-serif font-medium mb-2">
            Camera Access Required
          </h3>
          <p className="text-muted text-sm mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-luxury btn-gold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-charcoal">
      {/* Video element (hidden but captures camera) */}
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover transform scale-x-[-1]"
        style={{
          filter: 'brightness(1.02) saturate(1.05) contrast(1.02)',
        }}
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
        className="absolute inset-0 w-full h-full pointer-events-none makeup-transition"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Vignette overlay for luxury mirror effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
        }}
      />

      {/* Loading overlay */}
      {isInitializing && (
        <div className="absolute inset-0 flex items-center justify-center bg-charcoal/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="spinner mx-auto mb-6" />
            <p className="text-white text-base font-medium">Initializing</p>
            <p className="text-muted text-sm mt-2">Please allow camera access</p>
          </div>
        </div>
      )}

      {/* Face detection indicator */}
      {!isInitializing && isCameraActive && (
        <div className="absolute top-4 left-4">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium backdrop-blur-md transition-all duration-300 ${
            useStore.getState().isFaceDetected
              ? 'bg-white/10 text-white/90 border border-white/20'
              : 'bg-white/5 text-white/60 border border-white/10'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full transition-colors ${
              useStore.getState().isFaceDetected
                ? 'bg-gold'
                : 'bg-white/40 animate-pulse'
            }`} />
            {useStore.getState().isFaceDetected ? 'Face Detected' : 'Position your face'}
          </div>
        </div>
      )}

      {/* Compare mode indicator */}
      {isCompareMode && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-4 px-5 py-2.5 bg-charcoal/70 backdrop-blur-md rounded-full border border-white/10">
            <span className="text-white/70 text-xs font-medium tracking-wide">Before</span>
            <div className="w-px h-3 bg-white/20" />
            <span className="text-white/70 text-xs font-medium tracking-wide">After</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Camera;
