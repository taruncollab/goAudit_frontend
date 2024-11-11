import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import SignaturePad from "react-signature-canvas";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function DigitalSignModel(props) {
  const {
    open,
    setOpen,
    imageURL,
    setImageURL,
    signatures,
    setSignatures,
    sigCanvas,
  } = props;

  //Clear signature-----
  const handleClear = (index) => {
    sigCanvas[index].current.clear();
  };

  //Save signature-----
  const handleSaveSignature = (index) => {
    const newSignatures = [...signatures];

    newSignatures[index] = sigCanvas[index].current
      .getTrimmedCanvas()
      .toDataURL("image/png");

    setSignatures(newSignatures);
  };

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

      const newImages = [...imageURL];
      newImages[index] = photo;
      setImageURL(newImages);

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Error accessing camera: ", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
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
          {[0, 1, 2]?.map((index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <h5>Person Signature {index + 1}</h5>
              <div>
                <SignaturePad
                  ref={sigCanvas[index]}
                  canvasProps={{
                    width: 500,
                    height: 150,
                    className: "sigCanvas",
                  }}
                />

                <div style={{ display: "flex", gap: "10px" }}>
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
              </div>
              <div>
                {imageURL[index] && (
                  <div>
                    <img
                      src={imageURL[index]}
                      alt={`Person ${index + 1} Photo`}
                      style={{
                        width: "100px",
                        height: "100px",
                        marginTop: "10px",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Save Changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}
