import { useEffect, useRef, useState } from "react";
import { Camera, RefreshCw, RotateCcw, Check, X } from "lucide-react";

const WebRtcCamera = ({ maxWidth = 800, onImageCaptured, onImageConfirmed, onClose }) => {
  const videoRef = useRef(null);
  const [imageCapture, setImageCapture] = useState(null);
  const [currentStream, setCurrentStream] = useState(null);
  const [availableCameras, setAvailableCameras] = useState([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);

  useEffect(() => {
    initCamera();
    return () => stopCamera(); // Cleanup on unmount
  }, []);

  const initCamera = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === "videoinput");
      setAvailableCameras(cameras);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: maxWidth }, facingMode: "environment" },
      });

      setCurrentStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const switchCamera = async () => {
    if (availableCameras.length < 2) return;

    stopCamera();
    const nextIndex = (currentCameraIndex + 1) % availableCameras.length;
    setCurrentCameraIndex(nextIndex);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: availableCameras[nextIndex].deviceId },
          width: { ideal: maxWidth },
        },
      });

      setCurrentStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    const capturedImage = canvas.toDataURL("image/jpeg");

    setImageCapture(capturedImage);
    onImageCaptured(capturedImage);
    stopCamera();
  };

  const retakePhoto = () => {
    setImageCapture(null);
    initCamera();
  };

  const confirmImage = () => {
    if (imageCapture) {
      onImageConfirmed(imageCapture);
      stopCamera();
    }
  };

  const cancelCapture = () => {
    stopCamera();
    setImageCapture(null);
    onClose();
  };

  const stopCamera = () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center">
      <div className="w-full max-w-md aspect-square relative">
        {!imageCapture ? (
          <div className="relative">
            <video ref={videoRef} autoPlay className="w-full h-full object-cover rounded-lg" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button onClick={captureImage} className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600">
                <Camera className="h-6 w-6" />
              </button>
              <button onClick={switchCamera} className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600">
                <RefreshCw className="h-6 w-6" />
              </button>
              <button onClick={cancelCapture} className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600">
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img src={imageCapture} className="w-full h-full object-cover rounded-lg" alt="Captured" loading="lazy" />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
              <button onClick={retakePhoto} className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600">
                <RotateCcw className="h-6 w-6" />
              </button>
              <button onClick={confirmImage} className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600">
                <Check className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebRtcCamera;
