import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
  Box,
  Button,
  Checkbox,
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
import { toast } from "react-toastify";
import { getQuestions } from "../../apis/questionSlice";

export default function Form() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.authData);
  const { question } = useSelector((state) => state.questionData);

  const { id } = useParams();

  const [openRemarkIndex, setOpenRemarkIndex] = useState(null);
  const [upload, setUpload] = useState(null);
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

  useEffect(() => {
    const callApi = async() => {
      const res = await dispatch(getQuestions());

    }
    callApi();
  }, []);

  useEffect(() => {
    if (id) {
      const data = question.find((f) => f._id == id);

      if (data) {
        const newValues = {
          ...values,
          compId: data.compId || "",
          locId: data.locId || "",
          categoryId: data.categoryId || "",
          title: data.title || "",
          formData: data.questions.map((q) => ({
            text: q.question || "",
            type: q.type || "",
            options: q.options || "",
            prefAns: q.prefAns || "",
            answer: [],
            attachment: "",
            remark: "",
          })),
          // score: 0,
        };

        setValues(newValues);
      }
    }
  }, [id]);

  // useEffect(() => {
  //   values.formData.map((v, index) => {
  //     let updatedValues = { ...values };
  //     if (v?.type == "yes/no") {
  //       if (v.answer == v.prefAns) {
  //         updatedValues= {
  //           ...updatedValues, score: updatedValues.score + 1
  //         };
  //       }
  //     }
  //     // return updatedValues
  //   })
  // }, [values]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedValues = { ...values };

    updatedValues.formData[index] = {
      ...updatedValues.formData[index],
      answer: value,
    };

    // if (value == updatedValues.formData[index].prefAns) {
    //   updatedValues.score = updatedValues.score + 1;
    // }

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

      setUpload(file.name);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await dispatch(addForm({...values, createdBy: auth._id}));
    if (res.type.includes("fulfilled")) {
      navigate("/formrecords");
      setValues({});
      toast.success(res.payload.message)
    }
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} container justifyContent={"space-between"}>
          <Typography className={formCSS.title}>FILL FORM</Typography>
          <Typography mr={9} className={formCSS.head}>
            {values?.title}
          </Typography>
        </Grid>

        <Grid item md={11} xs={11} mt={1} ml={3} mr={3}>
          <form noValidate>
            {values &&
              values.formData.map((data, index) => {
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
                      <span className={formCSS.questionText}>{data?.text}</span>
                    </Typography>
                    <Grid container  alignItems={"center"} justifyContent={"flex-start"} spacing={2} mt={1} ml={1}>
                      <Grid item xs={12} md={4}>
                        <Button className={formCSS.attachmentBtn}>
                          {/* attachment photo */}
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
                      <Grid item xs={12} md={2} ml={{xs:0, md:3}}>
                        <Button
                          size="small"
                          className={formCSS.remarkBtn}
                          onClick={() => setOpenRemarkIndex(index)}
                        >
                          add remarks
                        </Button>
                      </Grid>
                    </Grid>

                    {data?.type === "yes/no" && (
                      <Grid ml={3} mt={1} mb={1}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="yes/no"
                            name={inputName}
                            value={values.formData[index].answer}
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
                      <Grid ml={3} mr={3} mt={1} mb={1}>
                        <TextareaAutosize
                          name={inputName}
                          value={values.formData[index].answer || ""}
                          minRows={3}
                          style={{ width: 503 }}
                          onChange={(e) => handleChange(e, index)}
                        />
                      </Grid>
                    )}

                    {data?.type === "options" && (
                      <Grid ml={3} mt={1} mb={1}>
                        <FormControl component="fieldset">
                          <RadioGroup
                            aria-label="options"
                            name={inputName}
                            value={values.formData[index].selectedOption}
                            onChange={(e) => handleChange(e, index)}
                          >
                            <Stack direction={"row"} gap={2}>
                              {data?.options.map((option, optionIndex) => (
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
                              {data?.options.map((option, optionIndex) => (
                                <FormControlLabel
                                  key={optionIndex}
                                  control={
                                    <Checkbox
                                      checked={values.formData[
                                        index
                                      ].answer.includes(option)}
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
              <Button className={formCSS.submitBtn} onClick={handleSubmit}>
                Submit
              </Button>
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
