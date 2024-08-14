import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import {
  Select,
  MenuItem,
  IconButton,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Label } from "@mui/icons-material";
import {
  addQuestion,
  getQuestions,
  updateQuestionbyid,
} from "../../apis/questionSlice";
import questionCSS from "./question.module.scss";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { toast } from "react-toastify";
import { getAllCompanies } from "../../apis/companySlice";
import { getAllLocations } from "../../apis/locationSlice";

export default function QuestionForm() {
  const types = ["yes/no", "descriptive", "options", "multichoice"];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.authData);
  const { comp } = useSelector((state) => state.companyData);
  const { location } = useSelector((state) => state.locationData);
  const { category } = useSelector((state) => state.categoryData);
  const { question } = useSelector((state) => state.questionData);

  const { id } = useParams();

  const [values, setValues] = useState({
    compId: "",
    locId: "",
    categoryId: "",
    title: "",
    questions: [
      {
        question: "",
        type: "",
        prefAns: [],
        options: [],
      },
    ],
  });

  useEffect(() => {
    const callAPI = () => {
      dispatch(getAllCompanies());
      dispatch(getAllLocations());
    };
    callAPI();
  }, []);

  useEffect(() => {
    if (id) {
      const data = question.find((f) => f._id == id);
      setValues(data);
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleQuestionChange = (event, index) => {
    const { value } = event.target;

    setValues((prevValues) => {
      const updatedQuestions = prevValues.questions.map((question, idx) => {
        if (idx == index) {
          return { ...question, question: value };
        }
        return question;
      });

      return {
        ...prevValues,
        questions: updatedQuestions,
      };
    });
  };

  const handleTypeChange = (event, questionIndex) => {
    const { value } = event.target;

    setValues((prevValues) => {
      const updatedQuestions = prevValues.questions.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            type: value,
            options: ["options", "multichoice"].includes(value) ? [""] : [],
          };
        }
        return question;
      });

      return {
        ...prevValues,
        questions: updatedQuestions,
      };
    });
  };

  const handlePrefAnsChange = (questionIndex, value) => {
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];
      updatedQuestions[questionIndex].prefAns = [value]; // Ensure prefAns is an array
      return { ...prevValues, questions: updatedQuestions };
    });
  };

  const handleAddQuestion = () => {
    const newQuestion = { question: "", type: "", prefAns: [], options: [] };

    setValues((prevState) => ({
      ...prevState,
      questions: [...prevState.questions, newQuestion],
    }));
  };

  const handleRemoveQuestion = (index) => {
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];

      updatedQuestions.splice(index, 1);
      return {
        ...prevValues,
        questions: updatedQuestions,
      };
    });
  };

  const handleAddOption = (questionIndex) => {
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];
      updatedQuestions[questionIndex].options.push("");
      return {
        ...prevValues,
        questions: updatedQuestions,
      };
    });
  };

  const handleOptionChange = (event, questionIndex, optionIndex) => {
    const { value } = event.target;

    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];
      updatedQuestions[questionIndex].options[optionIndex] = value;

      return {
        ...prevValues,
        questions: updatedQuestions,
      };
    });
  };

  const handleRemoveOption = (questionIndex, optionIndex) => {
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];
      updatedQuestions[questionIndex].options.splice(optionIndex, 1);
      return {
        ...prevValues,
        questions: updatedQuestions,
      };
    });
  };

  const handlePreferredOption = (questionIndex, option) => {
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];
      updatedQuestions[questionIndex].prefAns = [option]; // Ensure prefAns is an array
      return { ...prevValues, questions: updatedQuestions };
    });
  };

  const handlePreferredChange = (questionIndex, option) => {
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];
      const question = updatedQuestions[questionIndex];

      // Toggle the option in prefAns array
      if (question?.prefAns?.includes(option)) {
        question.prefAns = question.prefAns.filter((item) => item !== option);
      } else {
        question.prefAns = [...question.prefAns, option];
      }

      return { ...prevValues, questions: updatedQuestions };
    });
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   if (id) {
  //     const res = await dispatch(
  //       updateQuestionbyid({ ...values, createdBy: auth._id })
  //     );
  //     if (res.type.includes("fulfilled")) {
  //       navigate("/question");
  //       setValues({});
  //       toast.success(res.payload.message);
  //     }
  //   } else {
  //     if (values.compId == "") {
  //       toast.warning("Please Select Company");
  //     } else if (values.locId == "") {
  //       toast.warning("Please Select Location");
  //     } else if (values.categoryId == "") {
  //       toast.warning("Please Select Category");
  //     } else if (values.title == "") {
  //       toast.warning("Please Enter a Title");
  //     } else if (values.questions.length >= 1) {
  //       if (
  //         values.questions.map((q) => {
  //           q?.question === "";
  //         })
  //       ) {
  //         toast.warning("Please Enter Question");
  //       } else if (
  //         values.questions.map(q => q.type == "")
  //       ) {
  //         toast.warning("Please Select Question Type");
  //       } else if (
  //         values.questions.map(q => q.type == "yes/no" && q.prefAns.length < 1)
  //       ) {
  //         toast.warning("Please Select Preferred answer");
  //       } else if (
  //         values.questions.map(q => q.type == "options" && q.options && q.options.map(o => o == ""))
  //       ) {
  //         toast.warning("Please Enter Option");
  //         if (values.questions.map(q => q.options.map(o => o != "") && q.prefAns.length < 1)) {
  //           toast.warning("Please Select Preferred answer");
  //         }
  //       } else if (
  //         values.questions.map(q => q.type == "multichoice" && q.options && q.options.map(o => o == ""))
  //       ) {
  //         toast.warning("Please Enter Option");
  //         if (values.questions.map(q => q.options.map(o => o != "") && q.prefAns.length < 1)) {
  //           toast.warning("Please Select Preferred answer");
  //         }
  //       }
  //     } else {
  //       const res = await dispatch(
  //         addQuestion({ ...values, createdBy: auth._id })
  //       );
  //       if (res.type.includes("fulfilled")) {
  //         navigate("/question");
  //         setValues({});
  //         toast.success(res.payload.message);
  //       }

  //     }
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!values.compId) return toast.warning("Please Select Company");
    if (!values.locId) return toast.warning("Please Select Location");
    if (!values.categoryId) return toast.warning("Please Select Category");
    if (!values.title) return toast.warning("Please Enter a Title");

    const hasInvalidQuestion = values.questions.some(q => {
        if (!q.question) return true;
        if (!q.type) return true;
        if (q.type === "yes/no" && !q.prefAns.length) return true;
        if ((q.type === "options" || q.type === "multichoice") && !q.options.length) return true;
        if ((q.type === "options" || q.type === "multichoice") && q.options.some(o => !o)) return true;
        if ((q.type === "options" || q.type === "multichoice") && !q.prefAns.length) return true;
        return false;
    });

    if (hasInvalidQuestion) return toast.warning("Please fill all fields correctly");

    // Submit form
    const action = id ? updateQuestionbyid : addQuestion;
    const res = await dispatch(action({ ...values, createdBy: auth._id }));

    if (res.type.includes("fulfilled")) {
        navigate("/question");
        setValues({
            compId: "",
            locId: "",
            categoryId: "",
            title: "",
            questions: [{ question: "", type: "", prefAns: [], options: [] }],
        });
        toast.success(res.payload.message);
    }
};


  return (
    <>
      <Grid>
        <Typography className={questionCSS.title}>QUESTION</Typography>
        <Grid item md={12} mx={3} mt={4} mb={4} className={questionCSS.main}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack gap={0.3} ml={{ xs: 2, md: 5 }} mr={{ xs: 2, md: 1 }}>
                  <InputLabel htmlFor="compId" className={questionCSS.outLabel}>
                    Company
                  </InputLabel>
                  <Select
                    id="compId"
                    name="compId"
                    value={values?.compId}
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      <p className={questionCSS.inLabel}>Select Company</p>
                    </MenuItem>
                    {comp &&
                      comp.map((c, index) => {
                        return (
                          <MenuItem key={index} value={c?._id}>
                            {c?.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack gap={0.3} ml={{ xs: 2, md: 1 }} mr={{ xs: 2, md: 5 }}>
                  <InputLabel htmlFor="locId" className={questionCSS.outLabel}>
                    Location
                  </InputLabel>
                  <Select
                    id="locId"
                    name="locId"
                    value={values?.locId}
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      <p className={questionCSS.inLabel}>Select Location</p>
                    </MenuItem>
                    {location &&
                      location
                        ?.filter((l) => values?.compId === l?.compId)
                        .map((l, index) => (
                          <MenuItem key={index} value={l?._id}>
                            {l?.locName}
                          </MenuItem>
                        ))}
                  </Select>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack gap={0.3} ml={{ xs: 2, md: 5 }} mr={{ xs: 2, md: 1 }}>
                  <InputLabel
                    htmlFor="categoryId"
                    className={questionCSS.outLabel}
                  >
                    Category
                  </InputLabel>
                  <Select
                    id="categoryId"
                    name="categoryId"
                    value={values?.categoryId}
                    size="small"
                    fullWidth
                    onChange={handleChange}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      <p className={questionCSS.inLabel}>Select Category</p>
                    </MenuItem>
                    {category &&
                      category.map((c, index) => {
                        return (
                          <MenuItem key={index} value={c?._id}>
                            {c?.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack gap={0.3} ml={{ xs: 2, md: 1 }} mr={{ xs: 2, md: 5 }}>
                  <InputLabel htmlFor="title" className={questionCSS.outLabel}>
                    Title
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    type="text"
                    id="title"
                    name="title"
                    value={values?.title || ""}
                    size="small"
                    onChange={handleChange}
                    placeholder="Title of Form"
                    InputProps={{
                      classes: questionCSS.inLabelTxt,
                    }}
                  />
                </Stack>
              </Grid>

              {/* <div
                style={{
                  border: "none",
                  borderTop: "1px dotted #878787",
                  marginTop: "20px",
                  paddingLeft: "30px",
                  width: "98%",
                  visibility: "visible",
                  zIndex: '100'
                }}
              ></div> */}

              {values?.questions?.map((question, index) => {
                return (
                  <>
                    <Grid item xs={12} md={12} key={index}>
                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <Stack
                            gap={0.3}
                            ml={{ xs: 2, md: 5 }}
                            mr={{ xs: 2, md: 2 }}
                          >
                            <InputLabel
                              htmlFor={`questions-${index}-question`}
                              className={questionCSS.outLabel}
                            >
                              Question {index + 1}
                            </InputLabel>
                            <OutlinedInput
                              fullWidth
                              type="text"
                              id={`questions-${index}-question`}
                              name={`questions[${index}].question`}
                              value={question?.question || ""}
                              size="small"
                              onChange={(event) =>
                                handleQuestionChange(event, index, "question")
                              }
                              placeholder="Your Question"
                            />
                          </Stack>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <Stack
                            gap={0.3}
                            ml={{ xs: 2, md: 2 }}
                            mr={{ xs: 2, md: 5 }}
                          >
                            <InputLabel
                              htmlFor={`questions.${index}.type`}
                              className={questionCSS.outLabel}
                            >
                              Type
                            </InputLabel>
                            <Select
                              fullWidth
                              id={`questions.${index}.type`}
                              type="text"
                              name={`questions.${index}.type`}
                              value={question.type}
                              size="small"
                              onChange={(event) =>
                                handleTypeChange(event, index)
                              }
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                <p className={questionCSS.inLabel}>
                                  Type of question
                                </p>
                              </MenuItem>
                              {types.map((type, i) => (
                                <MenuItem key={i} value={type}>
                                  {type}
                                </MenuItem>
                              ))}
                            </Select>
                          </Stack>
                        </Grid>

                        {/* option select add option */}
                        {question.type === "options" && (
                          <Grid item xs={12} md={11}>
                            {question?.options.map((option, optionIndex) => (
                              <Grid
                                container
                                item
                                mt={2}
                                mb={2}
                                md={12}
                                ml={{ md: 5, xs: 2 }}
                                key={optionIndex}
                              >
                                <Grid container item md={6} xs={10}>
                                  <OutlinedInput
                                    fullWidth
                                    id={`questions-${index}-options-${optionIndex}`}
                                    name={`questions[${index}].options[${optionIndex}]`}
                                    value={option || ""}
                                    size="small"
                                    onChange={(event) =>
                                      handleOptionChange(
                                        event,
                                        index,
                                        optionIndex
                                      )
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  container
                                  alignItems={"center"}
                                  xs={6}
                                  md={4}
                                  ml={{ md: 4 }}
                                >
                                  <Checkbox
                                    checked={question.prefAns?.includes(option)}
                                    onChange={() =>
                                      handlePreferredOption(index, option)
                                    }
                                  />
                                  <Grid ml={1} mr={1}>
                                    <IconButton
                                      className={questionCSS.plusBG}
                                      fullWidth
                                      onClick={() => handleAddOption(index)}
                                    >
                                      <AddIcon className={questionCSS.plus} />
                                    </IconButton>
                                  </Grid>
                                  <Grid ml={1}>
                                    {optionIndex > 0 && (
                                      <IconButton
                                        className={questionCSS.minusBG}
                                        onClick={() =>
                                          handleRemoveOption(index, optionIndex)
                                        }
                                      >
                                        <RemoveIcon
                                          className={questionCSS.minus}
                                        />
                                      </IconButton>
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                            ))}
                          </Grid>
                        )}

                        {question.type == "multichoice" && (
                          <Grid item xs={12} md={11}>
                            {question?.options.map((option, optionIndex) => (
                              <Grid
                                container
                                item
                                mt={2}
                                mb={2}
                                md={12}
                                ml={{ md: 5, xs: 2 }}
                                key={optionIndex}
                              >
                                <Grid container item md={6} xs={10}>
                                  <OutlinedInput
                                    fullWidth
                                    id={`questions-${index}-options-${optionIndex}`}
                                    name={`questions[${index}].options[${optionIndex}]`}
                                    value={option || ""}
                                    size="small"
                                    onChange={(event) =>
                                      handleOptionChange(
                                        event,
                                        index,
                                        optionIndex
                                      )
                                    }
                                    placeholder={`Option ${optionIndex + 1}`}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  container
                                  alignItems={"center"}
                                  xs={6}
                                  md={4}
                                  ml={{ md: 4 }}
                                >
                                  <Checkbox
                                    checked={question?.prefAns?.includes(
                                      option
                                    )}
                                    onChange={() =>
                                      handlePreferredChange(index, option)
                                    }
                                  />
                                  <Grid mr={1}>
                                    <IconButton
                                      fullWidth
                                      className={questionCSS.plusBG}
                                      onClick={() => handleAddOption(index)}
                                    >
                                      <AddIcon className={questionCSS.plus} />
                                    </IconButton>
                                  </Grid>
                                  <Grid>
                                    {optionIndex > 0 && (
                                      <IconButton
                                        className={questionCSS.minusBG}
                                        onClick={() =>
                                          handleRemoveOption(index, optionIndex)
                                        }
                                      >
                                        <RemoveIcon
                                          className={questionCSS.minus}
                                        />
                                      </IconButton>
                                    )}
                                  </Grid>
                                </Grid>
                              </Grid>
                            ))}
                          </Grid>
                        )}

                        {question.type === "yes/no" && (
                          <Grid container alignItems={"center"} mt={2} ml={5}>
                            <Typography mr={2} className={questionCSS.outLabel}>
                              Preferred Answer:
                            </Typography>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={question.prefAns.includes("yes")}
                                  onChange={() =>
                                    handlePrefAnsChange(index, "yes")
                                  }
                                  color="primary"
                                />
                              }
                              label="Yes"
                            />
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={question.prefAns.includes("no")}
                                  onChange={() =>
                                    handlePrefAnsChange(index, "no")
                                  }
                                  color="primary"
                                />
                              }
                              label="No"
                            />
                          </Grid>
                        )}

                        <Grid
                          container
                          item
                          md={12}
                          justifyContent={"flex-end"}
                          xs={2}
                          ml={4}
                          mr={5}
                          mt={1}
                        >
                          {index > 0 && (
                            <Button
                              onClick={() => handleRemoveQuestion(index)}
                              className={questionCSS.cancel}
                            >
                              Remove
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </>
                );
              })}

              {/* option select add option  finish */}

              <Grid item xs={6} md={2} ml={{ xs: 2, md: 5 }}>
                <Button
                  variant="contained"
                  onClick={handleAddQuestion}
                  className={questionCSS.add}
                >
                  <ControlPointIcon /> Add Question
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                md={12}
                mb={3}
                mr={5}
                gap={2}
                container
                justifyContent="flex-end"
                alignItems="flex-end"
              >
                <Button
                  disableElevation
                  size="small"
                  type="button"
                  variant="contained"
                  className={questionCSS.cancel}
                  onClick={() => {
                    // id
                    //   ? navigate(`/questiondetails/${id}`)
                    //   :
                    navigate("/question");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  disableElevation
                  size="small"
                  type="submit"
                  variant="contained"
                  className={questionCSS.submit}
                >
                  {id ? "Edit" : "Add"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
}
