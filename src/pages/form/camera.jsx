import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import formCSS from "./form.module.scss";
import { Button } from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VideocamIcon from "@mui/icons-material/Videocam";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import DeleteIcon from "@mui/icons-material/Delete";

const Camera = ({photos, setPhotos, videoBlobs, setVideoBlobs}) => {
  const webcamRef = useRef(null);
  // const [photos, setPhotos] = useState([]);
  // const [videoBlobs, setVideoBlobs] = useState([]);
  const [recording, setRecording] = useState(false);
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
      setVideoBlobs((data) => [...data, blob]);
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
    setVideoBlobs([]);
  };

  // Remove specific photo by index
  const removePhoto = (index) => {
    setPhotos((data) => data.filter((_, i) => i !== index));
  };

  // Remove specific video by index
  const removeVideo = (index) => {
    setVideoBlobs((data) => data.filter((_, i) => i !== index));
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
        <div key={index} style={{ position: "relative" }}>
          <img src={urlData} alt={`Screenshot ${index}`} />
          <Button size="small" onClick={() => removePhoto(index)}>
            <DeleteIcon sx={{ color: "red" }} />
          </Button>
        </div>
      ))}

      {/* Display recorded videos */}
      {videoBlobs?.map((blob, index) => (
        <div key={index} style={{ position: "relative" }}>
          <h3>Recorded Video {index + 1}:</h3>
          <video src={URL.createObjectURL(blob)} controls />
          <a
            href={URL.createObjectURL(blob)}
            download={`video${index + 1}.webm`}
          >
            Download Video
          </a>
          <Button
            onClick={() => removeVideo(index)}
            className={formCSS.remarkBtn}
          >
            <DeleteIcon sx={{ color: "red" }} />
          </Button>
        </div>
      ))}
    </>
  );
};

export default Camera;
