import { createRef, useEffect, useRef, useState } from "react";
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
import { toast } from "react-toastify";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function Form() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { auth } = useSelector((state) => state.authData);
  const { question } = useSelector((state) => state.questionData);
  const { formLoading } = useSelector((state) => state.formData);

  // State Zone---------------------
  const [openRemarkIndex, setOpenRemarkIndex] = useState(null);
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
        remark: "",
      },
    ],
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getQuestions({}));

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
          remark: "",
        })),
      };

      setValues(newValues);
    }
  }, [id]);

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
    const { name, value } = e.target;

    const updatedValues = { ...values };

    updatedValues.formData[index] = {
      ...updatedValues.formData[index],
      remark: value,
    };

    setValues(updatedValues);
  };

  const handleCheck = (option, index) => {
    const isChecked = values.formData[index].answer.includes(option.target.value);

    if (isChecked) {
      const updatedAnswer = values.formData[index].answer.filter(item => item !== option.target.value);
      updateFormData(index, updatedAnswer);
    } else {
      const updatedAnswer = [...values.formData[index].answer, option.target.value];
      updateFormData(index, updatedAnswer);
    }
  };

  const updateFormData = (index, updatedAnswer) => {
    const updatedValues = { ...values };
    updatedValues.formData[index].answer = updatedAnswer;
    setValues(updatedValues);
  };

  const handleSelectedFile = (event, index) => {
    const files = event.target.files;
    const updatedValues = { ...values };

    updatedValues.formData[index] = {
      ...updatedValues.formData[index],
      attachment: [],
    };

    Array.from(files)?.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result;
        updatedValues.formData[index].attachment.push(base64String);
        setValues({ ...updatedValues });
      };
      reader.onerror = (error) => {
        console.error("Error uploading file:", error);
      };
    });
  };
 
  const cameraRefs = useRef([...Array(values.questions.length)].map(() => createRef()));

  const handleTakePhoto = (index) => {
    // Capture photo from the corresponding camera
    const photo = cameraRefs.current[index].current.takePhoto();
    
    // Update form data with the new photo
    const updatedValues = { ...values };
    updatedValues.formData[index].attachment.push(photo);
    setValues(updatedValues);

    // Optionally display the captured image
    setImage(photo);
  };

  const handleCameraClose = () => {
    // Logic to close the camera
    // if (camera.current) {
    //   camera.current.stop();
    // }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (values?.formData?.map((f) => f?.answer?.length)?.includes(0)) {
      return toast.warning("Please Answer All Questions");
    }

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

        <Grid item md={11} xs={11} mt={4} ml={3} mr={3}>
          <form noValidate>
            {values &&
              values?.formData?.map((data, index) => {
                const inputName = `formData${[index]}.answer`;
                const attachmentName = `formData${[index]}.attachment`;
                const remarkName = `formData${[index]}.remark`;
                return (
                  <Grid
                    container
                    direction={"column"}
                    mt={1}
                    mb={2}
                    key={index}
                    className={formCSS.questionBox}
                  >
                    <Typography pt={2} ml={3}>
                      <img
                        src="/src/assets/Question.png"
                        style={{
                          width: "25px",
                          height: "25px",
                          marginRight: "5px",
                        }}
                      />
                      <span className={formCSS.questionText}>{data?.text}</span>
                    </Typography>
                    <Grid
                      container
                      alignItems={"center"}
                      justifyContent={"flex-start"}
                      spacing={2}
                      mt={1}
                      ml={1}
                    >
                      <Grid item xs={12} md={4}>
                        <Button className={formCSS.attachmentBtn}>
                          <input
                            type="file"
                            multiple
                            name={attachmentName}
                            id="attachment"
                            accept=".jpg, .png"
                            onChange={(event) =>
                              handleSelectedFile(event, index)
                            }
                          />
                        </Button>

                        <Button
                          className={formCSS.remarkBtn}
                          size="small"
                          variant="contained"
                          color="info"
                          onClick={() => handleTakePhoto(index)}
                        >
                          <CameraAltIcon sx={{ mr: 1, color: "white" }} /> Take
                          photo
                        </Button>

                        {/* Add camera stop button if needed */}
                        <Button
                          className={formCSS.remarkBtn}
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={handleCameraClose}
                        >
                          Stop Camera
                        </Button>
                      </Grid>

                      <Grid item xs={12} md={2} ml={{ xs: 0, md: 3 }}>
                        <Button
                          size="small"
                          className={formCSS.remarkBtn}
                          onClick={() => setOpenRemarkIndex(index)}
                        >
                          <NoteAltIcon sx={{ mr: 1 }} /> add remarks
                        </Button>
                      </Grid>
                    </Grid>

                    {/* Options here------------ */}

                    {data?.type === "yesno" && (
                      <FormControl>
                        <RadioGroup
                          row
                          name={inputName}
                          value={values?.formData[index]?.answer}
                          onChange={(e) => handleChange(e, index)}
                        >
                          <FormControlLabel
                            value="Yes"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            value="No"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}

                    {data?.type === "multiple" && (
                      <FormControl>
                        <FormGroup>
                          {data?.options.map((opt, i) => {
                            return (
                              <FormControlLabel
                                key={i}
                                control={
                                  <Checkbox
                                    value={opt}
                                    checked={values?.formData[index]?.answer?.includes(opt)}
                                    onChange={(e) => handleCheck(e, index)}
                                  />
                                }
                                label={opt}
                              />
                            );
                          })}
                        </FormGroup>
                      </FormControl>
                    )}

                    {data?.type === "text" && (
                      <TextField
                        variant="standard"
                        name={inputName}
                        value={values?.formData[index]?.answer}
                        onChange={(e) => handleChange(e, index)}
                        fullWidth
                        required
                      />
                    )}
                    {data?.type === "textarea" && (
                      <TextareaAutosize
                        style={{ width: "100%" }}
                        minRows={5}
                        name={inputName}
                        value={values?.formData[index]?.answer}
                        onChange={(e) => handleChange(e, index)}
                      />
                    )}
                  </Grid>
                );
              })}
            <Button
              className={formCSS.submitBtn}
              onClick={handleSubmit}
              disabled={formLoading}
            >
              {formLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Grid>
      </Grid>
    </>
  );
}
