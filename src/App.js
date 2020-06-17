import React from "react";
import "./App.css";
import * as faceapi from 'face-api.js';

function App() {
  const [loadedModels, setLoadedModels] = React.useState(false);
  const [cameraReady, setCameraReady] = React.useState(false);
  const videoRef = React.useRef();
  const streamRef = React.useRef();
  const captureAnimationFrame = React.useRef();
  const inputSize = 480;
  const scoreThreshold = 0.5;
  React.useEffect(() => {
    async function initCamera() {
      console.log('init camera start: ');
      const stream = await navigator.mediaDevices.getUserMedia(
        { video: { width: 600, height: 450 } }
      )
      console.log('init camera done: ');
      streamRef.current = stream;
      videoRef.current.onloadedmetadata = function onPlay() {
        videoRef.current.play();
      };
      videoRef.current.onplay = () => {
        console.log('playing video: ');
        setCameraReady(true);
      }
      videoRef.current.srcObject = streamRef.current;
    }
    initCamera();
  }, [])

  React.useEffect(() => {
    const loadModel = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models');
      console.log('load model done ');
      setLoadedModels(true)
    }
    loadModel();
  }, []);

  React.useEffect(() => {
    if(cameraReady && loadedModels){
      const getFace = async () => {
        const face = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({
          inputSize,
          scoreThreshold
        })).withFaceLandmarks(true);
        console.log(face);
        captureAnimationFrame.current = (videoRef.current) && window.requestAnimationFrame(getFace);
      }

      getFace();
    }
  }, [cameraReady, loadedModels]);

  return (
    <div className="App">
      <h5>test faceapi</h5>
      <video ref={videoRef} className="stream" />
    </div>
  );
}

export default App;
