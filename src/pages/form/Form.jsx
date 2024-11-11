import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import formCSS from "./form.module.scss";
import { addForm } from "../../apis/formSlice";
import { getQuestions } from "../../apis/questionSlice";
import Swal from "sweetalert2";
import {
  NoteAlt as NoteAltIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";
import DigitalSignModel from "./DigitalSign";

export default function Form() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { auth } = useSelector((state) => state.authData);
  const { question } = useSelector((state) => state.questionData);
  const { formLoading } = useSelector((state) => state.formData);

  // State Zone---------------------
  const fileInputRefs = useRef([]);
  const [values, setValues] = useState({
    compId: "",
    locId: "",
    categoryId: "",
    title: "",
    questions: [],
    formData: [
      {
        text: "",
        type: "",
        options: [],
        prefAns: "",
        answer: [],
        attachment: [],
        showAttachment: [],
        remark: "",
      },
    ],
    // score: 0,
  });
  const [open, setOpen] = useState(false);
  const [imageURL, setImageURL] = useState([null, null, null]);
  const [signatures, setSignatures] = useState([null, null, null]);
  const sigCanvas = [useRef(), useRef(), useRef()];

  console.log(signatures, "aaaaaaaa");
  console.log(imageURL, "camera Photo");

  //Effect Zone---------------------
  useEffect(() => {
    if (id) {
      dispatch(getQuestions({}));
    }
  }, [id]);

  useEffect(() => {
    const data = question && question?.find((f) => f?._id == id);

    const newValues = {
      ...values,
      compId: data?.compId || "",
      locId: data?.locId || "",
      categoryId: data?.categoryId || "",
      title: data?.title || "",
      formData: data?.questions?.map((q) => ({
        text: q?.question || "",
        type: q?.type || "",
        options: q?.options || "",
        prefAns: q?.prefAns || "",
        answer: [],
        attachment: [],
        showAttachment: [],
        remark: "",
      })),
      // score: 0,
    };

    setValues(newValues);
  }, [question]);

  // For Radio Button------------------------

  const handleChange = (e, index) => {
    const { value } = e.target;
    let updatedValues = { ...values };

    updatedValues.formData[index] = {
      ...updatedValues.formData[index],
      answer: [value],
    };

    setValues(updatedValues);
  };

  const handleRemark = (e, index) => {
    const { value } = e.target;

    const updatedValues = { ...values };

    updatedValues.formData[index] = {
      ...updatedValues.formData[index],
      remark: value,
    };

    setValues(updatedValues);
  };

  const handleCheck = (option, index) => {
    const isChecked = values.formData[index].answer.includes(
      option.target.value
    );

    if (isChecked) {
      const updatedAnswer = values.formData[index].answer.filter(
        (item) => item !== option.target.value
      );
      updateFormData(index, updatedAnswer);
    } else {
      const updatedAnswer = [
        ...values.formData[index].answer,
        option.target.value,
      ];
      updateFormData(index, updatedAnswer);
    }
  };

  const updateFormData = (index, updatedAnswer) => {
    const updatedValues = { ...values };
    updatedValues.formData[index].answer = updatedAnswer;
    setValues(updatedValues);
  };

  const handleSelectedFile = async (event, index) => {
    const files = event.target.files;
    const updatedValues = { ...values };

    const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    };

    const base64Files = await Promise.all(
      Array.from(files).map((file) => fileToBase64(file))
    );

    updatedValues.formData[index] = {
      ...updatedValues.formData[index],
      attachment: [...updatedValues.formData[index].attachment, ...base64Files],
      showAttachment: [
        ...updatedValues.formData[index].showAttachment,
        ...files,
      ],
    };

    setValues({ ...updatedValues });

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = "";
    }
  };

  // const toggleCamera = (index) => {
  //   setOpenCameraIndex((prev) => ({
  //     ...prev,
  //     [index]: !prev[index],
  //   }));
  // };

  // Handle Submit===================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values?.formData?.map((f) => f?.answer?.length)?.includes(0)) {
      return toast.warning("Please Answer All Questions");
    }

    // Upload the file to S3

    const finalData = {
      ...values,
      compId: values?.compId?._id,
      locId: values?.locId?._id,
      categoryId: values?.categoryId?._id,
      createdBy: auth?._id,
    };

    const res = await dispatch(addForm(finalData));

    if (res.type.includes("fulfilled")) {
      navigate("/formrecords");
      setValues({});
      Swal.fire({
        title: "Success",
        text: res.payload.message,
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const removeFile = (qIndex, index) => {
    const updatedValues = { ...values };
    updatedValues.formData[qIndex].attachment = updatedValues?.formData?.[
      qIndex
    ]?.attachment?.filter((_, i) => i !== index);

    updatedValues.formData[qIndex].showAttachment = updatedValues?.formData?.[
      qIndex
    ]?.showAttachment?.filter((_, i) => i !== index);
    setValues(updatedValues);
  };

  return (
    <>
      <Grid className={formCSS.mainBox}>
        <div
          className={formCSS.header}
          style={{
            width: "100% !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            className={formCSS.title}
            style={{ display: "flex", alignItems: "center" }}
          >
            <AssignmentIcon style={{ fontSize: "30px" }} /> FILL FORM
          </Typography>

          <img
            src="/img/fillForm.jpg"
            alt="Fill Form Animation"
            className={formCSS.questionimage}
          />
        </div>

        <div className={formCSS.header}>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Title Section */}
            <Grid container item xs={12} md={6} spacing={2}>
              <Grid item xs={6}>
                <Typography className={formCSS.key1}>Title</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={formCSS.value1}>
                  {values?.title}
                </Typography>
              </Grid>
            </Grid>

            {/* Company Section */}
            <Grid container item xs={12} md={6} spacing={2}>
              <Grid item xs={6}>
                <Typography className={formCSS.key1}>Company</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={formCSS.value1}>
                  {values?.compId?.name}
                </Typography>
              </Grid>
            </Grid>

            {/* Category Section */}
            <Grid container item xs={12} md={6} spacing={2}>
              <Grid item xs={6}>
                <Typography className={formCSS.key1}>Category</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={formCSS.value1}>
                  {values?.categoryId?.name}
                </Typography>
              </Grid>
            </Grid>

            {/* Location Section */}
            <Grid container item xs={12} md={6} spacing={2}>
              <Grid item xs={6}>
                <Typography className={formCSS.key1}>Location</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={formCSS.value1}>
                  {values?.locId?.locName}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </div>

        <Grid item md={11} xs={11} mt={4} ml={3} mr={3}>
          {/* <form noValidate> */}
          {values &&
            values?.formData?.map((data, index) => {
              const inputName = `formData${[index]}.answer`;
              const attachment = `formData${[index]}.attachment`;

              const remarkName = `formData${[index]}.remark`;
              return (
                <>
                  <Grid
                    container
                    direction={"column"}
                    mt={1}
                    mb={2}
                    key={index}
                    className={formCSS.questionBox}
                  >
                    <Typography
                      pt={2}
                      ml={3}
                      sx={{ fontWeight: "bold", display: "flex", gap: 1 }}
                    >
                      <span className={formCSS.questionText}>{index + 1}.</span>

                      <span className={formCSS.questionText}>{data?.text}</span>
                    </Typography>

                    {data?.type === "yes/no" && (
                      <Grid ml={3} mt={2} mb={1}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="yes/no"
                            name={inputName}
                            value={values.formData[index]?.answer[0]}
                            onChange={(e) => handleChange(e, index)}
                          >
                            <Stack direction={"row"} gap={2}>
                              <FormControlLabel
                                value="yes"
                                control={<Radio />}
                                label="Yes"
                              />
                              <FormControlLabel
                                value="no"
                                control={<Radio />}
                                label="No"
                              />
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    )}

                    {data?.type === "descriptive" && (
                      <Grid ml={3} mr={3} mt={2} mb={1}>
                        <TextareaAutosize
                          name={inputName}
                          value={values.formData[index].answer || ""}
                          minRows={2}
                          placeholder="Enter your answer...."
                          style={{
                            width: 380,
                            borderRadius: "20px",
                            borderColor: "#f77e09",
                            padding: "10px",
                            boxSizing: "border-box",
                          }}
                          onChange={(e) => handleChange(e, index)}
                        />
                      </Grid>
                    )}

                    {data?.type === "options" && (
                      <Grid ml={3} mt={2} mb={1}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="options"
                            name={inputName}
                            value={values.formData[index].selectedOption}
                            onChange={(e) => handleChange(e, index)}
                          >
                            <Stack direction={"row"} gap={2}>
                              {data?.options?.map((option, optionIndex) => (
                                <FormControlLabel
                                  key={optionIndex}
                                  value={option}
                                  control={<Radio />}
                                  label={option}
                                />
                              ))}
                            </Stack>
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    )}

                    {data?.type === "multichoice" && (
                      <Grid ml={3} mt={1} mb={1}>
                        <FormControl component="fieldset">
                          <FormGroup>
                            <Stack direction={"row"} gap={2}>
                              {data?.options?.map((option, optionIndex) => (
                                <FormControlLabel
                                  key={optionIndex}
                                  control={
                                    <Checkbox
                                      checked={values.formData[
                                        index
                                      ].answer?.includes(option)}
                                      onChange={(e) => handleCheck(e, index)}
                                      value={option}
                                    />
                                  }
                                  label={option}
                                />
                              ))}
                            </Stack>
                          </FormGroup>
                        </FormControl>
                      </Grid>
                    )}

                    <Grid
                      container
                      alignItems={"center"}
                      justifyContent={"flex-start"}
                      spacing={1}
                      mt={1}
                      ml={1}
                    >
                      <Grid item xs={12} md={12}>
                        <Button>
                          <input
                            type="file"
                            multiple
                            name="attachments"
                            id="attachment"
                            accept=".jpg, .png, .pdf, .mp4"
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            onChange={(event) =>
                              handleSelectedFile(event, index)
                            }
                          />
                        </Button>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        {data?.showAttachment?.length > 0 && (
                          <>
                            <b style={{ marginBottom: "1rem" }}>Images</b>
                            <Grid container spacing={1}>
                              {data.showAttachment
                                ?.filter((file) =>
                                  file.type.startsWith("image")
                                )
                                .map((file, aIndex) => (
                                  <Grid item xs={12} md={12} key={aIndex}>
                                    <div className="file-item">
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "10px",
                                        }}
                                      >
                                        <img
                                          style={{ width: "100px" }}
                                          src={URL.createObjectURL(file)}
                                        ></img>

                                        <CloseIcon
                                          color="error"
                                          onClick={() =>
                                            removeFile(index, aIndex)
                                          }
                                        />
                                        <p>{file.name}</p>
                                      </div>
                                    </div>
                                  </Grid>
                                ))}
                            </Grid>
                            <br />
                            <b>Videos</b>
                            <Grid container spacing={1}>
                              {data?.showAttachment
                                .filter((file) => file.type.startsWith("video"))
                                .map((file, aIndex) => (
                                  <Grid item xs={12} md={12} key={aIndex}>
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "10px",
                                      }}
                                    >
                                      <video
                                        style={{ width: "150px" }}
                                        controls
                                      >
                                        <source
                                          src={URL.createObjectURL(file)}
                                        />
                                      </video>
                                      <CloseIcon
                                        color="error"
                                        onClick={() =>
                                          removeFile(index, aIndex)
                                        }
                                      />
                                      <p>{file.name}</p>
                                    </div>
                                  </Grid>
                                ))}
                            </Grid>
                            <br />
                            <b>Documents</b>
                            <Grid container spacing={1}>
                              {data?.showAttachment
                                ?.filter((file) =>
                                  file.type.startsWith("application")
                                )
                                ?.map((file, aIndex) => (
                                  <Grid item xs={12} md={12} key={aIndex}>
                                    <div className="file-item">
                                      <div
                                        style={{
                                          display: "flex",
                                          gap: "10px",
                                        }}
                                      >
                                        {file.type === "application/pdf" && (
                                          <embed
                                            src={URL.createObjectURL(file)}
                                            width="200px"
                                            height="200px"
                                            type="application/pdf"
                                          />
                                        )}

                                        <CloseIcon
                                          color="error"
                                          onClick={() =>
                                            removeFile(index, aIndex)
                                          }
                                        />
                                        <p>{file.name}</p>
                                      </div>
                                    </div>
                                  </Grid>
                                ))}
                            </Grid>
                          </>
                        )}
                      </Grid>

                      {/* Open Camera--------- */}

                      {/* <Button
                      size="small"
                      className={formCSS.remarkBtn}
                      onClick={() => toggleCamera(index)}
                    >
                      {openCameraIndex[index] ? "Close Camera" : "Open Camera"}
                    </Button>

                    {openCameraIndex[index] && (
                      <Camera
                        index={index}
                        photos={photos}
                        setPhotos={setPhotos}
                        videoBlobs={videoBlobs}
                        setVideoBlobs={setVideoBlobs}
                      />
                    )} */}

                      {/* Open Camera--------- */}

                      {/* <Grid item xs={12} md={2} ml={{ xs: 0, md: 0 }}>
                      <Button
                        size="small"
                        className={formCSS.remarkBtn}
                        onClick={() =>
                          setOpenRemarkIndex([index, !openRemarkIndex[1]])
                        }
                      >
                        <NoteAltIcon sx={{ mr: 1 }} /> Add remarks
                      </Button>
                    </Grid> */}
                    </Grid>

                    {/* {openRemarkIndex[1] && openRemarkIndex[0] === index && (
                    <Grid ml={3} mr={3} mt={1} mb={1}>
                      <TextField
                        className="my-2"
                        type="text"
                        label="Remarks"
                        size="small"
                        fullWidth
                        name={remarkName}
                        onChange={(e) => handleRemark(e, index)}
                      />
                    </Grid>
                  )} */}

                    <Grid ml={2} mr={3} mt={1} mb={1}>
                      <TextField
                        className="my-2"
                        type="text"
                        label="Remarks"
                        size="small"
                        fullWidth
                        name={remarkName}
                        onChange={(e) => handleRemark(e, index)}
                      />
                    </Grid>
                  </Grid>
                </>
              );
            })}

          {/* Signature Part */}

          <Grid
            ml={1}
            mr={3}
            mt={3}
            mb={1}
            sx={{ display: "flex", justifyContent: "left", alignItems: "left" }}
          >
            <DigitalSignModel
              open={open}
              setOpen={setOpen}
              imageURL={imageURL}
              setImageURL={setImageURL}
              signatures={signatures}
              setSignatures={setSignatures}
              sigCanvas={sigCanvas}
            />
          </Grid>

          <Stack
            gap={2}
            direction={"row"}
            justifyContent={"flex-end"}
            mt={3}
            mb={2}
          >
            {formLoading && formLoading ? (
              <>
                <Button className={formCSS.submitBtn}>
                  <CircularProgress /> Submitting...
                </Button>
              </>
            ) : (
              <>
                <Button className={formCSS.submitBtn} onClick={handleSubmit}>
                  Submit
                </Button>
              </>
            )}

            <Button
              className={formCSS.cancelBtn}
              onClick={() => navigate(`/showforms`)}
            >
              Cancel
            </Button>
          </Stack>
          {/* </form> */}
        </Grid>
      </Grid>
    </>
  );
}
