import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, Grid, Stack, Typography } from "@mui/material";
import {
  getCategoryName,
  getCompanyName,
  getLocationName,
} from "../../common/common";
import formCSS from "./form.module.scss";
import { getAllCompanies } from "../../apis/companySlice";
import { getAllLocations } from "../../apis/locationSlice";

const FormDetails = () => {
  const [details, setDetails] = useState(null);

  const navigate = useNavigate();

  const { form } = useSelector((state) => state.formData);
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
    const data = form.find((f) => f._id == id);
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
              <Typography className={formCSS.auditTitle}>
                {details?.title.toUpperCase()}
              </Typography>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Company</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  : {getCompanyName(details?.compId, comp)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Location</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  : {getLocationName(details?.locId, location)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Category</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  : {getCategoryName(details?.categoryId, category)}
                </Typography>
              </Grid>
            </Grid>
            <Grid container item direction={"row"} mb={1}>
              <Grid item md={2} xs={6}>
                <Typography className={formCSS.key}>Score</Typography>
              </Grid>
              <Grid item md={6} xs={6}>
                <Typography className={formCSS.value}>
                  : {details?.score}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Stack item gap={2} md={4} xs={6} mr={4}>
            {/* <Button
              className={formCSS.edit}
              onClick={() => navigate(`/questionform/${id}`)}
            >
              Edit
            </Button> */}
            <Button
              className={formCSS.backBtn}
              onClick={() => navigate("/formrecords")}
            >
              Back
            </Button>
          </Stack>
        </Grid>
        {details &&
          details?.formData?.map((d, i) => {
            return (
              <Grid mr={4} mb={2} className={formCSS.questionCard}>
                <Card>
                  <Grid className={formCSS.questionHead}>
                    <Typography ml={2} className={formCSS.questionTitleText}>
                      <span className={formCSS.questionNum}>
                        Question {i + 1}:
                      </span>
                      &nbsp;&nbsp;&nbsp; {d?.question}
                    </Typography>
                  </Grid>
                  <CardContent className={formCSS.cardContent}>
                    <Grid container direction={"column"}>
                      <Grid container item>
                        <Grid item md={2} className={formCSS.questionKey}>
                          Type
                        </Grid>
                        <Grid item md={10}>
                          :{d?.type}
                        </Grid>
                      </Grid>
                      {d?.options.length !== 0 ? (
                        <Grid container item>
                          <Grid item md={2} className={formCSS.questionKey}>
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
                      <Grid container item>
                        <Grid item md={2} className={formCSS.questionKey}>
                          Answer
                        </Grid>
                        <Grid item md={10}>
                          :
                          {d?.type === "multichoice" ? (
                            d?.prefAns
                              .filter((p) => p.trim() !== "") // Filter out blank or whitespace-only strings
                              .map((p, index) => (
                                <span key={index}>
                                  <b>{index + 1}.</b>{" "}
                                  <span className={formCSS.prefAns}>{p}</span>
                                  &nbsp;&nbsp;&nbsp;&nbsp;
                                </span>
                              ))
                          ) : (
                            <span className={formCSS.prefAns}>{d?.answer}</span>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
      </Grid>
    </>
    // <>
    //   <div className="d-flex flex-row justify-content-between">
    //     <div>
    //       <h2>{details?.title.toUpperCase()}</h2>
    //       <h5>Company: &nbsp; {getCompanyName(details?.compId, comp)}</h5>
    //       <h5>Location: &nbsp;&nbsp;&nbsp;&nbsp; {getLocationName(details?.locId, location)}</h5>
    //       <h5>Category: &nbsp;&nbsp; {getCategoryName(details?.categoryId, category)}</h5>
    //       <h5>Score: &nbsp;&nbsp; {details?.score}</h5>
    //     </div>
    //     <div>
    //       <Button variant="contained" onClick={() => navigate(`/formrecords`)}>
    //         Back
    //       </Button>
    //     </div>
    //   </div>
    //   <Card sx={{ minWidth: 275 }}>
    //     {details &&
    //       details.formData.map((d, i) => {
    //         return (
    //           <div
    //             style={{
    //               background: '#0000ff24',
    //               padding: '0'
    //             }}
    //           >
    //             <CardContent style={{ borderTop: '1px solid #878787' }}>
    //               <div style={{ padding: '0' }}>
    //                 <Typography variant="h5" component="div" className="mb-2">
    //                   Que {i + 1}: {d?.text}
    //                 </Typography>
    //                 <Typography variant="body2">
    //                   <span style={{ fontWeight: 'bold' }}>Type: </span>
    //                   {d?.type}
    //                 </Typography>
    //                 <Typography variant="body2">
    //                   <span style={{ fontWeight: 'bold' }}>Ans: </span>
    //                   {d?.type == 'multichoice' ? (
    //                     <>
    //                       {d.answer.map((e) => {
    //                         return (
    //                           <p>
    //                             {e} <br />
    //                           </p>
    //                         );
    //                       })}
    //                     </>
    //                   ) : (
    //                     <>{d?.answer}</>
    //                   )}
    //                 </Typography>
    //                 {d?.remark ? (
    //                   <Typography variant="body2">
    //                     <span style={{ fontWeight: 'bold' }}>Remark: </span>
    //                     {d?.remark}{' '}
    //                   </Typography>
    //                 ) : (
    //                   <></>
    //                 )}
    //                 {d?.attachment ? (
    //                   <div className="d-flex flex-column align-item-start">
    //                     <span style={{ fontWeight: 'bold' }}>Attachment: </span>
    //                     <img src={d?.attachment} alt="attachment image" style={{
    //                       width: '10rem'
    //                     }} />
    //                   </div>
    //                 ) : (
    //                   <></>
    //                 )}
    //                 {/* <hr /> */}
    //               </div>
    //             </CardContent>
    //           </div>
    //         );
    //       })}
    //   </Card>
    //   <div className="d-flex justify-content-end mt-3">
    //     {/* <Button variant="contained" onClick={() => navigate('/formrecords')}>
    //       Back
    //     </Button> */}
    //   </div>
    // </>
  );
};

export default FormDetails;
