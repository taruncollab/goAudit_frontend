import { useCallback, useEffect, useState } from "react";
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
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ControlPoint as ControlPointIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

import { addQuestion, updateQuestionbyid } from "../../apis/questionSlice";
import questionCSS from "./question.module.scss";
import { toast } from "react-toastify";
import { getCompanies } from "../../apis/companySlice";
import { getLocationbyCompid } from "../../apis/locationSlice";
import { debounce } from "lodash";
import { getCategories } from "../../apis/categorySlice";
import Swal from "sweetalert2";

export default function QuestionForm() {
  const types = ["yes/no", "descriptive", "options", "multichoice"];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => state.authData);

  const { question, questionLoading } = useSelector(
    (state) => state.questionData
  );

  const { id } = useParams();

  const [values, setValues] = useState({
    compId: { label: "", value: "" },
    locId: { label: "", value: "" },
    categoryId: { label: "", value: "" },
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
  const [compSearchInput, setCompSearchInput] = useState("");
  const [compOptions, setCompOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [categorySearchInput, setCategorySearchInput] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);

  //Effect Zone----------------------

  //Edit--
  useEffect(() => {
    if (id) {
      const data = question && question?.find((f) => f?._id == id);
      setValues(data);
    }
  }, [id]);

  // Company Search-------------------------------------

  const fetchOptions = useCallback(
    debounce(async (query) => {
      try {
        let response;

        if (query?.length === 0) {
          response = await dispatch(getCompanies({}));
        } else {
          response = await dispatch(getCompanies({ search: query }));
        }

        if (response?.type?.includes("fulfilled")) {
          const searchData = response?.payload?.data?.map((item) => ({
            label: item?.name,
            value: item?._id,
          }));

          setCompOptions(searchData);
        }
      } catch (error) {
        toast.error("Error fetching options:", error);
      }
    }, 1000),
    [dispatch]
  );

  useEffect(() => {
    if (compSearchInput !== undefined) {
      fetchOptions(compSearchInput);
    }
  }, [compSearchInput, fetchOptions]);

  // Location Search-------------------------------------

  // Location Search-------------------------------------

  const fetchLocationOptions = useCallback(
    debounce(async (query) => {
      try {
        let response = await dispatch(getLocationbyCompid({ id: query }));

        if (response?.type?.includes("fulfilled")) {
          if (response?.payload?.data?.length > 0) {
            const locationData = response?.payload?.data?.map((item) => ({
              label: item?.locName,
              value: item?._id,
            }));

            setLocationOptions(locationData);
          } else if (response?.payload?.data?.length == 0) {
            setLocationOptions([]);
            toast.warning("No Location Found");
          }
        }
      } catch (error) {
        toast.error("Error fetching options:", error);
      }
    }, 1000),
    [dispatch, values?.compId?.value]
  );

  useEffect(() => {
    if (values?.compId?.value !== undefined) {
      fetchLocationOptions(values?.compId?.value);
    }
  }, [values?.compId?.value, fetchLocationOptions]);

  // Category Search-------------------------------------

  const fetchCategoryOptions = useCallback(
    debounce(async (query) => {
      try {
        let response;

        if (query?.length === 0) {
          response = await dispatch(getCategories({}));
        } else {
          response = await dispatch(getCategories({ search: query }));
        }

        if (response?.type?.includes("fulfilled")) {
          const searchData = response?.payload?.data?.map((item) => ({
            label: item?.name,
            value: item?._id,
          }));

          setCategoryOptions(searchData);
        }
      } catch (error) {
        toast.error("Error fetching options:", error);
      }
    }, 1000),
    [dispatch]
  );

  useEffect(() => {
    if (categorySearchInput !== undefined) {
      fetchCategoryOptions(categorySearchInput);
    }
  }, [categorySearchInput, fetchCategoryOptions]);

  //-----------------------------------------------------------------

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
      const updatedQuestions = prevValues?.questions?.map((question, idx) => {
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
      const updatedQuestions = prevValues?.questions?.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            type: value,
            options: ["options", "multichoice"]?.includes(value) ? [""] : [],
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

  //Handel Pref Ans-----------------------

  const handlePrefAnsChange = (questionIndex, value) => {
    setValues((prevValues) => {
      const updatedQuestions = prevValues?.questions?.map((question, index) => {
        if (index === questionIndex) {
          return { ...question, prefAns: [value] };
        }
        return question;
      });

      return { ...prevValues, questions: updatedQuestions };
    });
  };

  // Add Question-----------------------

  const handleAddQuestion = () => {
    const newQuestion = { question: "", type: "", prefAns: [], options: [] };

    setValues((prevState) => ({
      ...prevState,
      questions: [...prevState.questions, newQuestion],
    }));
  };

  // Remove Question-----------------------
  const handleRemoveQuestion = (index) => {
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];

      updatedQuestions?.splice(index, 1);
      return {
        ...prevValues,
        questions: updatedQuestions,
      };
    });
  };

  // Add Option-----------------------

  const handleAddOption = (questionIndex) => {
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];
      updatedQuestions[questionIndex].options?.push("");
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

  // Remove Option-----------------------
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

  // Handle Preferred Answer as Option -----------------------

  const handlePreferredOption = (questionIndex, option) => {
    setValues((prevValues) => {
      const updatedQuestions = prevValues?.questions?.map((question, index) => {
        if (index === questionIndex) {
          return { ...question, prefAns: [option] };
        }
        return question;
      });

      return { ...prevValues, questions: updatedQuestions };
    });
  };

  const handlePreferredChange = (questionIndex, option) => {
    console.log(option, "option");
    setValues((prevValues) => {
      const updatedQuestions = [...prevValues.questions];

      const question = { ...updatedQuestions[questionIndex] };

      // Toggle the option in prefAns array
      if (question.prefAns.includes(option)) {
        // Remove the option if it exists
        question.prefAns = question.prefAns.filter((item) => item !== option);
      } else {
        // Add the option if it doesn't exist
        question.prefAns = [...question.prefAns, option];
      }

      // Update the question in the array
      updatedQuestions[questionIndex] = question;

      // Return the new state object
      return { ...prevValues, questions: updatedQuestions };
    });
  };

  // Handle Submit-------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!values.compId) return toast.warning("Please Select Company");
    if (!values.locId) return toast.warning("Please Select Location");
    if (!values.categoryId) return toast.warning("Please Select Category");
    if (!values.title) return toast.warning("Please Enter a Title");

    const hasInvalidQuestion = values?.questions?.some((q) => {
      if (!q.question) return true;
      if (!q.type) return true;
      if (q.type === "yes/no" && !q.prefAns.length) return true;
      if (
        (q.type === "options" || q.type === "multichoice") &&
        !q.options.length
      )
        return true;
      if (
        (q.type === "options" || q.type === "multichoice") &&
        q.options.some((o) => !o)
      )
        return true;
      if (
        (q.type === "options" || q.type === "multichoice") &&
        !q.prefAns.length
      )
        return true;
      return false;
    });

    if (hasInvalidQuestion)
      return toast.warning("Please fill all fields correctly");

    // Submit form--------------------------

    const action = id ? updateQuestionbyid : addQuestion;
    const res = await dispatch(action({ ...values, createdBy: auth?._id }));

    if (res.type.includes("fulfilled")) {
      navigate("/question");
      setValues({
        compId: { label: "", value: "" },
        locId: { label: "", value: "" },
        categoryId: { label: "", value: "" },
        title: "",
        questions: [{ question: "", type: "", prefAns: [], options: [] }],
      });
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
      <Grid>
        <Grid item md={12} mx={3} mt={2} mb={4} className={questionCSS.main}>
          <div className={questionCSS.header}>
            <Typography className={questionCSS.title}>
              {" "}
              <img
                src="/src/assets/Question.png"
                alt="/src/assets/Question.png"
                loading="lazy"
                style={{ width: "28px", height: "28px", marginRight: "5px" }}
              />
              {id ? "EDIT" : "ADD"} QUESTION
            </Typography>

            <img
              src="/img/addQuestion.gif"
              alt="/img/addQuestion.gif"
              loading="lazy"
              className={questionCSS.questionimage}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack gap={0.3} ml={{ xs: 2, md: 5 }} mr={{ xs: 2, md: 1 }}>
                  <InputLabel htmlFor="compId" className={questionCSS.outLabel}>
                    Company
                  </InputLabel>

                  <Autocomplete
                    id="compId"
                    name="compId"
                    options={compOptions}
                    getOptionLabel={(option) => option?.label || ""}
                    value={values?.compId || null}
                    onChange={(event, newValue) => {
                      handleChange({
                        target: {
                          name: "compId",
                          value: newValue || "",
                        },
                      });
                    }}
                    inputValue={compSearchInput}
                    onInputChange={(event, newInputValue) => {
                      setCompSearchInput(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Company"
                        size="small"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack gap={0.3} ml={{ xs: 2, md: 1 }} mr={{ xs: 2, md: 5 }}>
                  <InputLabel htmlFor="locId" className={questionCSS.outLabel}>
                    Location
                  </InputLabel>

                  <Autocomplete
                    id="locId"
                    name="locId"
                    options={locationOptions}
                    getOptionLabel={(option) => option?.label || ""}
                    value={values?.locId || null}
                    onChange={(event, newValue) => {
                      handleChange({
                        target: {
                          name: "locId",
                          value: newValue || "",
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Location"
                        size="small"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack gap={0.3} ml={{ xs: 2, md: 5 }} mr={{ xs: 2, md: 1 }}>
                  <InputLabel htmlFor="locId" className={questionCSS.outLabel}>
                    Category
                  </InputLabel>

                  <Autocomplete
                    id="categoryId"
                    name="categoryId"
                    options={categoryOptions || []}
                    getOptionLabel={(option) => option?.label || ""}
                    value={values?.categoryId || null}
                    onChange={(event, newValue) => {
                      handleChange({
                        target: {
                          name: "categoryId",
                          value: newValue || "",
                        },
                      });
                    }}
                    inputValue={categorySearchInput}
                    onInputChange={(event, newInputValue) => {
                      setCategorySearchInput(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Category"
                        size="small"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
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

              {values?.questions?.map((question, index) => {
                return (
                  <>
                    <Grid item xs={12} md={12} key={index} mt={2}>
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
                              {types?.map((type, i) => (
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
                            {question?.options?.map((option, optionIndex) => (
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

                        {/* --============== Multi Choice Option---======================== */}

                        {question?.type == "multichoice" && (
                          <Grid item xs={12} md={11}>
                            {question?.options?.map((option, optionIndex) => (
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

                                {/* Checkbox--------- */}

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

                                  {/* Add Button --------*/}
                                  <Grid mr={1}>
                                    <IconButton
                                      fullWidth
                                      className={questionCSS.plusBG}
                                      onClick={() => handleAddOption(index)}
                                    >
                                      <AddIcon className={questionCSS.plus} />
                                    </IconButton>
                                  </Grid>

                                  {/* Remove Button----------- */}
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

                        {/* --============== yes/no Option---======================== */}

                        {question?.type === "yes/no" && (
                          <Grid container alignItems={"center"} mt={2} ml={5}>
                            <Typography mr={2} className={questionCSS.outLabel}>
                              Preferred Answer:
                            </Typography>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={values?.questions[
                                    index
                                  ]?.prefAns?.includes("yes")}
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
                                  checked={values.questions[
                                    index
                                  ]?.prefAns?.includes("no")}
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
                              className={questionCSS.remove}
                            >
                              <DeleteIcon />
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
                    navigate("/question");
                  }}
                >
                  Cancel
                </Button>

                {questionLoading && questionLoading ? (
                  <>
                    <Button
                      fullWidth
                      disableElevation
                      className={questionCSS.submit}
                      // sx={{ textTransform: "none" }}
                    >
                      <CircularProgress /> Submitting...
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      disableElevation
                      size="small"
                      type="submit"
                      variant="contained"
                      className={questionCSS.submit}
                    >
                      {id ? "Edit" : "Add"}
                    </Button>
                  </>
                )}
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </>
  );
}
