import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActions, Grid, Stack, Typography } from "@mui/material";
import {
  getCategoryName,
  getCompanyName,
  getLocationName,
} from "../../common/common";
import questionCSS from "./question.module.scss";
import { getAllLocations } from "../../apis/locationSlice";
import { getAllCompanies } from "../../apis/companySlice";

const QuestionDetails = () => {
  const [details, setDetails] = useState(null);

  const navigate = useNavigate();

  const { question } = useSelector((state) => state.questionData);
  const { comp } = useSelector((state) => state.companyData);
  const { location } = useSelector((state) => state.locationData);
  const { category } = useSelector((state) => state.categoryData);
  const dispatch = useDispatch();

  const { id } = useParams();


  useEffect(() => {
    const callApi = () => {
      dispatch(getAllCompanies());
      dispatch(getAllLocations());
    }
    callApi();
  }, []);

  useEffect(() => {
    const data = question.find((f) => f._id == id);
    setDetails(data);
  }, [id]);


  return (
    <>
      <Grid container direction={"column"} pl={4}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={2}
        >
          <Grid container direction={"column"} item md={8} xs={6}>
            <Grid item mb={1}>
              <Typography className={questionCSS.auditTitle}>
                {details?.title.toUpperCase()}
              </Typography>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={questionCSS.key}>Company</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={questionCSS.value}>
                  : {getCompanyName(details?.compId, comp)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={questionCSS.key}>Location</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={questionCSS.value}>
                  : {getLocationName(details?.locId, location)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={questionCSS.key}>Category</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={questionCSS.value}>
                  : {getCategoryName(details?.categoryId, category)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Stack item gap={2} md={4} xs={6} mr={4}>
            <Button
              className={questionCSS.edit}
              onClick={() => navigate(`/questionform/${id}`)}
            >
              Edit
            </Button>
            <Button
              className={questionCSS.backBtn}
              onClick={() => navigate("/question")}
            >
              Back
            </Button>
          </Stack>
        </Grid>
        {details &&
          details.questions.map((d, i) => {
            return (
              <Grid mr={4} mb={2} className={questionCSS.questionCard}>
                <Card>
                  <Grid className={questionCSS.questionHead}>
                    <Typography ml={2} className={questionCSS.questionText}>
                      <span className={questionCSS.questionNum}>
                        Question {i + 1}:
                      </span>
                      &nbsp;&nbsp;&nbsp; {d?.question}
                    </Typography>
                  </Grid>
                  <CardContent className={questionCSS.cardContent}>
                    <Grid container direction={"column"}>
                      <Grid container item>
                        <Grid item md={2} className={questionCSS.questionKey}>
                          Type
                        </Grid>
                        <Grid item md={10}>
                          :{d?.type}
                        </Grid>
                      </Grid>
                          {d?.options.length !== 0 ? (
                            <Grid container item>
                              <Grid item md={2} className={questionCSS.questionKey}>
                                Options
                              </Grid>
                              <Grid item md={10}>
                                :
                                {d?.options.map((o, index) => (
                                  <span key={index}>
                                    <b>{index + 1}.</b> {o} &nbsp;&nbsp;&nbsp;&nbsp;
                                  </span>
                                ))}
                              </Grid>
                            </Grid>
                          ) : (
                            <></>
                          )}
                      {d?.prefAns.length > 0 ? (
                        <Grid container item>
                        <Grid item md={2} className={questionCSS.questionKey}>
                          Preferred Answer
                        </Grid>
                        <Grid item md={10}>
                          :{d?.type === "multichoice"
                            ? d?.prefAns
                                .filter((p) => p.trim() !== "") // Filter out blank or whitespace-only strings
                                .map((p, index) => (
                                  <span key={index}>
                                    <b>{index + 1}.</b> <span className={questionCSS.prefAns}>{p}</span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                  </span>
                                ))
                            : <span className={questionCSS.prefAns}>{d?.prefAns}</span>}
                        </Grid>
                      </Grid>
                      ) : (
                        <Grid container item>
                        <Grid item md={2} className={questionCSS.questionKey}>
                          Preferred Answer
                        </Grid>
                        <Grid item md={10}>
                          : <span className={questionCSS.prefAns}>N/A</span>
                        </Grid>
                      </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
  );
};

export default QuestionDetails;
