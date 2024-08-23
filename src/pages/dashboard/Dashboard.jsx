import { Grid, Typography, Box } from "@mui/material";
import style from "./dashboard.module.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import companyBlack from "../../assets/black/companyBlack.png";
import locationBlack from "../../assets/black/locationBlack.png";
import questionBlack from "../../assets/black/questionBlack.png";
import userBlack from "../../assets/black/userBlack.png";
import filledForm from "../../assets/black/formBlack.png";
import formRecordBlack from "../../assets/black/formRecordBlack.png";
import { useNavigate } from "react-router-dom";
import { getDashboardCount } from "../../apis/dashboardSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDashboardCount());
  }, []);

  const {
    loading,
    userCount,
    companyCount,
    locationCount,
    categoryCount,
    questionTempleteCount,
    formCount,
  } = useSelector((state) => state.dashboardData);

  const cards = [
    { title: "Users", count: userCount, img: userBlack, path: "/" },
    {
      title: "Companies",
      count: companyCount,
      img: companyBlack,
      path: "/company",
    },
    {
      title: "Locations",
      count: locationCount,
      img: locationBlack,
      path: "/location",
    },
    {
      title: "Categories",
      count: categoryCount,
      img: formRecordBlack,
      path: "/category",
    },
    {
      title: "Templetes",
      count: questionTempleteCount,
      img: questionBlack,
      path: "/showforms",
    },

    {
      title: "Filled Forms",
      count: formCount,
      img: filledForm,
      path: "/formrecords",
    },
  ];

  return (
    <Box className={style.dashboardContainer}>
      <Typography variant="h5" gutterBottom className={style.dashboardTitle}>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box className={style.card} onClick={() => navigate(card?.path)}>
              <Box className={style.cardImage}>
                <img src={card?.img} alt={card?.title} />
              </Box>
              <Box className={style.cardContent}>
                <Typography variant="h6">{card?.title}</Typography>
                <Typography variant="subtitle1">
                  <span>{loading ? "Loading..." : card?.count}</span>
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
