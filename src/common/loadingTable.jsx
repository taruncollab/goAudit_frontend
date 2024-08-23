import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

function SkeletonChildrenDemo(props) {
  const { loading = false } = props;

  return (
    <Card sx={{ width: "100%", marginBottom: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 1 }}>
          {loading ? (
            <Skeleton variant="circular" width={40} height={40}>
              <Avatar />
            </Skeleton>
          ) : (
            <Skeleton variant="circular" width={40} height={40}>
              <Avatar />
            </Skeleton>
          )}
          <Box sx={{ marginLeft: 2, flexGrow: 1 }}>
            {loading ? (
              <Skeleton width="100%">
                <Typography>.</Typography>
              </Skeleton>
            ) : (
              <Skeleton width="100%">
                <Typography>.</Typography>
              </Skeleton>
            )}
          </Box>
        </Box>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={140}>
            <div style={{ paddingTop: "57%" }} />
          </Skeleton>
        ) : (
          <Skeleton variant="rectangular" width="100%" height={140}>
            <div style={{ paddingTop: "57%" }} />
          </Skeleton>
        )}
      </CardContent>
    </Card>
  );
}

SkeletonChildrenDemo.propTypes = {
  loading: PropTypes.bool,
};

export default function SkeletonChildren() {
  return (
    <Grid container spacing={2} className="w-100" direction="column">
      <Grid item>
        <SkeletonChildrenDemo loading />
      </Grid>
      <Grid item>
        <SkeletonChildrenDemo />
      </Grid>
    </Grid>
  );
}
