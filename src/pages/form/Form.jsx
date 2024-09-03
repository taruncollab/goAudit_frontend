import { useEffect, useState } from "react";
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
        attachment: "",
        remark: "",
      },
    ],
    // score: 0,
  });

  //Effect Zone---------------------

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
          attachment: "",
          remark: "",
        })),
        // score: 0,
      };

      setValues(newValues);
    }
  }, [id]);

  console.log(values);

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
    const { name, value } = e.target;

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

  const handleSelectedFile = (event, index) => {
    const file = event.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result;

      const updatedValues = { ...values };

      updatedValues.formData[index] = {
        ...updatedValues.formData[index],
        attachment: base64String,
      };

      setValues(updatedValues);
    };

    reader.onerror = (error) => {
      console.error("Error uploading file:", error);
    };
  };

  // Handle Submit===================

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

        <div
          className={formCSS.header}
          style={{
            width: "100% !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Grid container item direction={"row"} ml={10}>
            <Grid item xs={6}>
              <Typography className={formCSS.key1}>Title</Typography>
            </Grid>
            <Grid item md={10} xs={6}>
              <Typography className={formCSS.value1}>
                {values?.title}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item direction={"row"}>
            <Grid item xs={6}>
              <Typography className={formCSS.key1}>Company</Typography>
            </Grid>
            <Grid item md={10} xs={6}>
              <Typography className={formCSS.value1}>
                {values?.compId?.name}
              </Typography>
            </Grid>
          </Grid>

          <Grid container item direction={"row"}>
            <Grid item xs={6}>
              <Typography className={formCSS.key1}>Category</Typography>
            </Grid>
            <Grid item md={10} xs={6}>
              <Typography className={formCSS.value1}>
                {values?.categoryId?.name}
              </Typography>
            </Grid>
          </Grid>
          <Grid container item direction={"row"}>
            <Grid item xs={6}>
              <Typography className={formCSS.key1}>Location</Typography>
            </Grid>
            <Grid item md={10} xs={6}>
              <Typography className={formCSS.value1}>
                {values?.locId?.locName}
              </Typography>
            </Grid>
          </Grid>
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
                            name={attachmentName}
                            id="attachment"
                            accept=".jpg, .png"
                            onChange={(event) =>
                              handleSelectedFile(event, index)
                            }
                          />
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

                    {data?.type === "yes/no" && (
                      //Radio Button---------------
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

                    {openRemarkIndex === index && (
                      <Grid ml={3} mr={3} mt={1} mb={1}>
                        <TextField
                          className="my-2"
                          type="text"
                          label="remarks"
                          size="small"
                          fullWidth
                          name={remarkName}
                          onChange={(e) => handleRemark(e, index)}
                        />
                      </Grid>
                    )}
                  </Grid>
                );
              })}
            {/* </Grid> */}

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
          </form>
        </Grid>
      </Grid>
    </>
  );
}
