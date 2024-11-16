import React, { useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SignaturePad from "react-signature-canvas";
import { useDispatch } from "react-redux";
import { updateFormnById } from "../../apis/formSlice";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DigitalSignModel({
  open,
  setOpen,
  imageURL,
  setImageURL,
  signatures,
  setSignatures,
  sigCanvas,
  formId,
}) {
  const dispatch = useDispatch();

  // State for person names
  const [personNames, setPersonNames] = useState(["", "", ""]);
  const [designation, setDesignation
  ] = useState([
    "Operation Manager's Signature",
    "Outlet Manager's Signature",
    "Franchise Owner's Signature",
  ]);

  // Clear the signature for a specific index
  const handleClear = (index) => {
    if (sigCanvas[index]?.current) {
      sigCanvas[index].current.clear();
    }
  };

  // Save the signature for a specific index
  const handleSaveSignature = (index) => {
    if (sigCanvas[index]?.current) {
      const newSignatures = [...signatures];
      newSignatures[index] = sigCanvas[index].current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      setSignatures(newSignatures);
    }
  };

  // Capture a photo from the camera for a specific index
  const handleCapturePhoto = async (index) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await new Promise((resolve) => (video.onloadedmetadata = resolve));
      video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const photo = canvas.toDataURL("image/png");

      const updatedImages = [...imageURL];
      updatedImages[index] = photo;
      setImageURL(updatedImages);

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  // Update person name
  const handlePersonNameChange = (index, value) => {
    const updatedNames = [...personNames];
    updatedNames[index] = value;
    setPersonNames(updatedNames);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Submit the data
  const handleSubmit = async () => {
    try {
      let finalData = {
        formId,
        signatures,
        cameraImages: imageURL,
        personNames,
        designation,
      };

      console.log(finalData);

      // const res = await dispatch(updateFormnById(finalData));

      // if (res.type.includes("fulfilled")) {
      //   toast.success(res.payload.message);
      //   setOpen(false);
      // } else {
      //   toast.warning(res.payload.message);
      // }
    } catch (error) {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Signature
      </Button>
      <BootstrapDialog onClose={handleClose} open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Signature Modal
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {[0, 1, 2].map((index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h5>
                {index + 1}. {designation[index]}
              </h5>
              <TextField
                fullWidth
                size="small"
                label="Person Name"
                variant="outlined"
                value={personNames[index]}
                onChange={(e) => handlePersonNameChange(index, e.target.value)}
                style={{ marginBottom: "10px" }}
              />
              <SignaturePad
                ref={sigCanvas[index]}
                canvasProps={{
                  width: 500,
                  height: 150,
                  className: "sigCanvas",
                }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <Button variant="outlined" onClick={() => handleClear(index)}>
                  Clear
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSaveSignature(index)}
                >
                  Save Signature
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleCapturePhoto(index)}
                >
                  Capture Photo
                </Button>
              </div>
              {imageURL[index] && (
                <div style={{ marginTop: "10px" }}>
                  <img
                    src={imageURL[index]}
                    alt={`Person ${index + 1} Photo`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={handleSubmit}>
            Save Changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
