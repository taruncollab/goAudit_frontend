import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import formCSS from "./form.module.scss";
import { Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VideocamIcon from "@mui/icons-material/Videocam";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const Camera = () => {
  const webcamRef = useRef(null);
  const [photos, setPhotos] = useState([]);
  const [recording, setRecording] = useState(false);
  const [videoBlob, setVideoBlob] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const videoConstraints = {
    width: 500,
    facingMode: facingMode,
  };

  // Capture a photo
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhotos((data) => [...data, imageSrc]);
  }, [webcamRef]);

  // Start recording video
  const startRecording = () => {
    setRecording(true);
    recordedChunks.current = [];
    const stream = webcamRef.current.stream;
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      setVideoBlob(blob);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  };

  const refresh = () => {
    setPhotos([]);
    setVideoBlob(null);
  };

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={true}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />

      <div style={{ display: "flex", gap: 5 }}>
        <Button onClick={capturePhoto} className={formCSS.remarkBtn}>
          <CameraAltIcon sx={{ mr: 1 }} /> Capture Photo
        </Button>

        {recording ? (
          <Button className={formCSS.remarkBtn} onClick={stopRecording}>
            <StopCircleIcon sx={{ color: "red", mr: 1 }} /> Stop Recording
          </Button>
        ) : (
          <Button className={formCSS.remarkBtn} onClick={startRecording}>
            <VideocamIcon sx={{ mr: 1 }} /> Start Recording
          </Button>
        )}

        <Button className={formCSS.remarkBtn} onClick={refresh}>
          <AutorenewIcon sx={{ mr: 1 }} /> Refresh
        </Button>

        <Button className={formCSS.remarkBtn} onClick={toggleFacingMode}>
          Switch to {facingMode === "user" ? "Back" : "Front"} Camera
        </Button>
      </div>

      {/* Display captured photos */}
      {photos?.map((urlData, index) => (
        <div key={index}>
          <img src={urlData} alt={`Screenshot ${index}`} />
        </div>
      ))}

      {/* Display recorded video if available */}
      {videoBlob && (
        <div>
          <h3>Recorded Video:</h3>
          <video src={URL.createObjectURL(videoBlob)} controls />
          <a href={URL.createObjectURL(videoBlob)} download="video.webm">
            Download Video
          </a>
        </div>
      )}
    </>
  );
};

export default Camera;
