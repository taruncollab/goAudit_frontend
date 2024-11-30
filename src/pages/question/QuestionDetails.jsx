import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Grid, Stack, Tooltip, Typography } from "@mui/material";
import questionCSS from "./question.module.scss";
import {
  AdsClick as AdsClickIcon,
  Edit as EditIcon,
  ReplyAll as ReplyAllIcon,
  FormatShapes as FormatShapesIcon,
  Draw as DrawIcon,
  Style as StyleIcon,
} from "@mui/icons-material";

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { question } = useSelector((state) => state.questionData);

  //State Zone----------------------------------------

  const [details, setDetails] = useState(null);

  // Effect Zone----------------------------------------

  useEffect(() => {
    if (id) {
      let data = question && question?.find((f) => f?._id == id);

      setDetails({
        ...data,
        compId: { value: data?.compId?._id, label: data?.compId?.name },
        locId: { value: data?.locId?._id, label: data?.locId?.locName },
        categoryId: {
          value: data?.categoryId?._id,
          label: data?.categoryId?.name,
        },
      });
    }
  }, [id]);

  return (
    <>
      <Grid container direction={"column"} pl={2}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={3}
        >
          <Grid container direction={"column"} item md={8} xs={6}>
            <Grid item mb={3} mt={2}>
              <Typography className={questionCSS.auditTitle}>
                <AdsClickIcon /> {details?.title?.toUpperCase()}
              </Typography>
            </Grid>

            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={questionCSS.key}>Company</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={questionCSS.value}>
                  : {details?.compId?.label || "No Company Name"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={questionCSS.key}>Location</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={questionCSS.value}>
                  : {details?.locId.label || "No Location Name"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={questionCSS.key}>Category</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={questionCSS.value}>
                  : {details?.categoryId?.label || "No Category Name"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Stack item gap={2} md={4} xs={6} mr={4}>
            <Button
              className={questionCSS.backBtn}
              onClick={() => navigate("/question")}
            >
              <ReplyAllIcon sx={{ mr: 1 }} /> Back
            </Button>

            <Tooltip title="Edit">
              <Button
                className={questionCSS.edit}
                onClick={() => navigate(`/questionform/${id}`)}
              >
                <EditIcon sx={{ mr: 1 }} /> Edit
              </Button>
            </Tooltip>
          </Stack>
        </Grid>
        {details &&
          details?.questions?.map((d, i) => {
            return (
              <>
                <Grid
                  mr={4}
                  className={questionCSS.questionCard}
                  sx={{
                    mb: { xs: 2, sm: 0, md: 0, lg: 0 },
                  }}
                >
                  <Card>
                    <Grid className={questionCSS.questionHead}>
                      <Typography ml={2} className={questionCSS.questionText}>
                        <span className={questionCSS.questionNum}>
                          <img
                            src="/src/assets/Question.png"
                            style={{
                              width: "23px",
                              height: "23px",
                              marginRight: "5px",
                            }}
                          />
                          Question {i + 1}:
                        </span>
                        &nbsp;&nbsp;&nbsp; {d?.question}
                      </Typography>
                    </Grid>
                    <CardContent className={questionCSS.cardContent}>
                      <Grid container direction={"column"}>
                        <Grid container item>
                          <Grid item md={2} className={questionCSS.questionKey}>
                            <FormatShapesIcon sx={{ mr: 1 }} /> Type :
                          </Grid>

                          <Grid item md={10}>
                            {d?.type}
                          </Grid>
                        </Grid>
                        {d?.options?.length !== 0 ? (
                          <Grid container item mt={2}>
                            <Grid
                              item
                              md={2}
                              className={questionCSS.questionKey}
                            >
                              <StyleIcon sx={{ mr: 1 }} /> Options :
                            </Grid>
                            <Grid item md={10}>
                              {d?.options?.map((o, index) => (
                                <span key={index}>
                                  <b>{index + 1}.</b> {o} &nbsp;&nbsp;&nbsp;
                                </span>
                              ))}
                            </Grid>
                          </Grid>
                        ) : (
                          <></>
                        )}
                        {d?.prefAns?.length > 0 ? (
                          <Grid container item mt={2}>
                            <Grid
                              item
                              md={2}
                              className={questionCSS.questionKey}
                            >
                              <DrawIcon sx={{ mr: 1 }} /> Preferred Answer :
                            </Grid>
                            <Grid item md={10}>
                              {d?.type === "multichoice" ? (
                                d?.prefAns
                                  ?.filter((p) => p.trim() !== "") // Filter out blank or whitespace-only strings
                                  .map((p, index) => (
                                    <span key={index}>
                                      <b>{index + 1}.</b>{" "}
                                      <span className={questionCSS.prefAns}>
                                        {p}
                                      </span>
                                      &nbsp;&nbsp;&nbsp;&nbsp;
                                    </span>
                                  ))
                              ) : (
                                <span className={questionCSS.prefAns}>
                                  {d?.prefAns}
                                </span>
                              )}
                            </Grid>
                          </Grid>
                        ) : (
                          <Grid container item mt={2}>
                            <Grid
                              item
                              md={2}
                              className={questionCSS.questionKey}
                            >
                              Preferred Answer :
                            </Grid>
                            <Grid item md={10}>
                              <span className={questionCSS.prefAns}>N/A</span>
                            </Grid>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            );
          })}
      </Grid>
    </>
  );
};

export default QuestionDetails;
