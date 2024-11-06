import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Grid, Stack, Tooltip, Typography } from "@mui/material";
import formCSS from "./form.module.scss";
import { getForms } from "../../apis/formSlice";
import {
  ReplyAll as ReplyAllIcon,
  AdsClick as AdsClickIcon,
  FormatShapes as FormatShapesIcon,
  Style as StyleIcon,
  Attachment as AttachmentIcon,
  NoteAlt as NoteAltIcon,
  Draw as DrawIcon,
} from "@mui/icons-material";

const FormDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { form } = useSelector((state) => state.formData);

  // State Zone---------------------

  const [details, setDetails] = useState(null);

  //Effect Zone---------------------

  //Edit-----
  useEffect(() => {
    if (id) {
      dispatch(getForms({}));
      const data = form && form?.find((f) => f?._id == id);
      setDetails(data);
    }
  }, [id, dispatch]);

  return (
    <>
      <Grid container direction={"column"} pl={4}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          mb={2}
        >
          <Grid container direction={"column"} item mt={2} md={11} xs={6}>
            <Grid
              item
              mb={1}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography className={formCSS.mainTitle}>
                {"Form Details".toUpperCase()}
              </Typography>

              <Typography>
                <Button
                  className={formCSS.backBtn}
                  onClick={() => navigate("/formrecords")}
                >
                  <ReplyAllIcon sx={{ mr: 1 }} /> Back
                </Button>
              </Typography>
            </Grid>

            <Grid item mb={1} mt={2}>
              <Typography className={formCSS.auditTitle}>
                <AdsClickIcon /> {details?.title?.toUpperCase()}
              </Typography>
            </Grid>

            <Grid container item direction={"row"} mb={1} mt={2}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Company</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  : {details?.compId?.label || "No Company Name"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Location</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  : {details?.locId[0]?.label || "No Location Name"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Category</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  : {details?.categoryId?.label || "No Category Name"}
                </Typography>
              </Grid>
            </Grid>

            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Score</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.ScoreTitle}>
                  : {details?.score || "No Data"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {details &&
          details?.formData?.map((d, i) => {
            return (
              <>
                <Grid mr={4} mb={2} className={formCSS.questionCard}>
                  <Card>
                    <Grid className={formCSS.questionHead}>
                      <Typography ml={2} className={formCSS.questionTitleText}>
                        <span className={formCSS.questionNum}>
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
                        &nbsp;&nbsp;&nbsp; {d?.text}
                      </Typography>
                    </Grid>
                    <CardContent className={formCSS.cardContent}>
                      <Grid container direction={"column"}>
                        <Grid container item mt={1}>
                          <Grid item md={2} className={formCSS.questionKey}>
                            <FormatShapesIcon sx={{ mr: 1 }} /> Type :
                          </Grid>
                          <Grid item md={10}>
                            {d?.type}
                          </Grid>
                        </Grid>
                        {d?.options?.length !== 0 ? (
                          <Grid container item mt={2}>
                            <Grid item md={2} className={formCSS.questionKey}>
                              <StyleIcon sx={{ mr: 1 }} /> Options :
                            </Grid>
                            <Grid item md={10}>
                              {d?.options?.map((o, index) => (
                                <span key={index}>
                                  <b>{index + 1}.</b> {o}
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                              ))}
                            </Grid>
                          </Grid>
                        ) : (
                          <></>
                        )}

                        <Grid container item mt={2}>
                          <Grid item md={2} className={formCSS.questionKey}>
                            <DrawIcon sx={{ mr: 1 }} /> Answer :
                          </Grid>
                          <Grid item md={10}>
                            {d?.type === "multichoice" ? (
                              d?.prefAns
                                ?.filter((p) => p?.trim() !== "") // Filter out blank or whitespace-only strings
                                .map((p, index) => (
                                  <span key={index}>
                                    <b>{index + 1}.</b>{" "}
                                    <span className={formCSS.prefAns}>
                                      {p || "No Answer"}
                                    </span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                  </span>
                                ))
                            ) : (
                              <span className={formCSS.prefAns}>
                                {d?.answer}
                              </span>
                            )}
                          </Grid>
                        </Grid>

                        {d?.remark?.length > 0 && (
                          <Grid container item mt={2}>
                            <Grid item md={2} className={formCSS.questionKey}>
                              <NoteAltIcon sx={{ mr: 1 }} /> Remarks :
                            </Grid>
                            <Grid item md={10}>
                              {d?.attachment && d?.remark.length > 0 && (
                                <>
                                  <span>{d?.remark}</span>
                                </>
                              )}
                            </Grid>
                          </Grid>
                        )}

                        {d?.attachment?.length > 0 && (
                          <Grid container item mt={2}>
                            <Grid item md={2} className={formCSS.questionKey}>
                              <AttachmentIcon sx={{ mr: 1 }} /> Attachment :
                            </Grid>

                            <Grid item md={10}>
                              {d?.attachment?.map((attachment, i) => (
                                <Tooltip title="Download" key={i}>
                                  <a
                                    href={attachment}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ marginRight: "10px" }}
                                  >
                                    <img
                                      src={attachment}
                                      style={{
                                        width: "250px",
                                        height: "200px",
                                        objectFit: "contain",
                                        margin: "10px 0",
                                      }}
                                      alt={`attachment-${i}`}
                                    />
                                  </a>
                                </Tooltip>
                              ))}
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

export default FormDetails;
