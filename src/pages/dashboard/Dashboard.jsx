import { Grid, Typography } from "@mui/material";
import style from "./dashboard.module.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCompanies } from "../../apis/companySlice";
import { getAllLocations } from "../../apis/locationSlice";
import { getQuestions } from "../../apis/questionSlice";

import companyBlack from "../../assets/black/companyBlack.png";
import locationBlack from "../../assets/black/locationBlack.png";
import questionBlack from "../../assets/black/questionBlack.png";
import userBlack from "../../assets/black/userBlack.png";
import formBlack from "../../assets/black/formBlack.png";
import formRecordBlack from "../../assets/black/formRecordBlack.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCompanies());
    dispatch(getAllLocations());
    dispatch(getQuestions());
  }, []);

  const { users } = useSelector((state) => state.authData);
  const { comp } = useSelector((state) => state.companyData);
  const { location } = useSelector((state) => state.locationData);
  const { category } = useSelector((state) => state.categoryData);
  const { question } = useSelector((state) => state.questionData);

  return (
    <>
      <Grid container item md={12}>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={2}
          ml={1}
          mr={1}
          mb={2}
          item
          xs={12}
          md={5}
          className={style.cards}
        >
          <Grid item md={3}>
            <img src={userBlack} alt="user" />
          </Grid>
          <Grid item md={9}>
            <Typography>
              {" "}
              Users: <b>{users.length}</b>{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={2}
          ml={1}
          mr={1}
          mb={2}
          item
          xs={12}
          md={5}
          className={style.cards}
          onClick={() => navigate("/company")}
        >
          <Grid item md={3}>
            <img src={companyBlack} alt="company" />
          </Grid>
          <Grid item md={9}>
            <Typography>
              {" "}
              Companies: <b>{comp.length}</b>{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={2}
          ml={1}
          mr={1}
          mb={2}
          item
          xs={12}
          md={5}
          className={style.cards}
          onClick={() => navigate("/location")}
        >
          <Grid item md={3}>
            <img src={locationBlack} alt="location" />
          </Grid>
          <Grid item md={9}>
            <Typography>
              {" "}
              Locations: <b>{location.length}</b>{" "}
            </Typography>
          </Grid>
        </Grid>

        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={2}
          ml={1}
          mr={1}
          mb={2}
          item
          xs={12}
          md={5}
          className={style.cards}
          onClick={() => navigate("/")}
        >
          <Grid item md={3}>
            <img src={formRecordBlack} alt="category" />
          </Grid>
          <Grid item md={9}>
            <Typography>
              {" "}
              Categories: <b>{category.length}</b>{" "}
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={2}
          ml={1}
          mr={1}
          mb={2}
          item
          xs={12}
          md={5}
          className={style.cards}
          onClick={() => navigate("/showforms")}
        >
          <Grid item md={3}>
            <img src={questionBlack} alt="templetes" />
          </Grid>
          <Grid item md={9}>
            <Typography>
              {" "}
              Templetes: <b>{question.length}</b>{" "}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
