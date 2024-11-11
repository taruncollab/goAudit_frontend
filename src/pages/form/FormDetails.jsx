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
import { Download as DownloadIcon } from "@mui/icons-material"; // Importing Material UI Download icon
import { splitOnLastDot } from "../../common/common";

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
    }
  }, [id]);

  useEffect(() => {
    const data = form && form?.find((f) => f?._id == id);
    setDetails(data);
  }, [form, id]);

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
                  : {(details && details?.compId?.name) || "No Company Name"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Location</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  : {(details && details?.locId?.locName) || "No Location Name"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Category</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  :{" "}
                  {(details && details?.categoryId?.name) || "No Category Name"}
                </Typography>
              </Grid>
            </Grid>

            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Score</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.ScoreTitle}>
                  : {(details && details?.score) || "No Data"}
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

                        <Grid item md={10}>
                          {d?.attachment?.map((attachment, i) => {
                            const fileExtension = splitOnLastDot(
                              attachment?.Location
                            );

                            const isImage = [
                              "jpg",
                              "jpeg",
                              "png",
                              "gif",
                              "bmp",
                            ]?.includes(fileExtension);

                            const isVideo = [
                              "mp4",
                              "mov",
                              "avi",
                              "mkv",
                              "webm",
                            ]?.includes(fileExtension);

                            const isPdf = fileExtension === "pdf";

                            return (
                              <Tooltip title="Download" key={i}>
                                <a
                                  href={attachment?.Location}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ marginRight: "10px" }}
                                >
                                  {isImage && (
                                    <img
                                      src={attachment?.Location}
                                      style={{
                                        width: "250px",
                                        height: "200px",
                                        objectFit: "contain",
                                        margin: "10px 0",
                                      }}
                                      alt={`attachment-${i}`}
                                    />
                                  )}

                                  {isVideo && (
                                    <video
                                      width="250"
                                      height="200"
                                      style={{ margin: "10px 0" }}
                                      controls
                                      alt={`attachment-${i}`}
                                    >
                                      <source
                                        src={attachment?.Location}
                                        type={`video/${fileExtension}`}
                                      />
                                      Your browser does not support the video
                                      tag.
                                    </video>
                                  )}

                                  {isPdf && (
                                    <embed
                                      src={attachment?.Location}
                                      width="250"
                                      height="200"
                                      type="application/pdf"
                                      style={{ margin: "10px 0" }}
                                      alt={`attachment-${i}`}
                                    />
                                  )}
                                </a>
                              </Tooltip>
                            );
                          })}

                          <Grid
                            ml={1}
                            mr={3}
                            mt={3}
                            mb={1}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                            }}
                          ></Grid>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </>
            );
          })}

        {/* //Show Signature Here---- */}
        <Card sx={{ p: 2, mb: 2 }}>
          <h6>Signature Here...</h6>

          {details?.cameraImages?.length > 0 ? (
            details?.cameraImages?.map((data, index) => (
              <div
                key={`pair-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "15px",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "10px",
                }}
              >
                {/* Displaying photo */}
                <img
                  src={data?.Location}
                  alt={`Person ${index + 1} Photo`}
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "20px",
                  }}
                />

                {details?.signatures?.[index] ? (
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={details?.signatures[index]?.Location}
                      alt={`Person ${index + 1} Signature`}
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    />
                    <h6 style={{ marginTop: "10px" }}>{`Person ${
                      index + 1
                    }`}</h6>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      marginLeft: "20px",
                    }}
                  >
                    <h6 style={{ marginTop: "10px" }}>
                      Signature not uploaded
                    </h6>
                  </div>
                )}
              </div>
            ))
          ) : (
            <h6 style={{ marginTop: "10px" }}>
              No photos or signatures uploaded
            </h6>
          )}
        </Card>
      </Grid>
    </>
  );
};

export default FormDetails;
