import React from "react";
import { Modal, Grid, Typography, Box, Button } from "@mui/material";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Rectangle,
} from "recharts";

const Chart = ({ open, handleClose, selectedRecords, formatTime }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose} // Ensures the modal closes when clicking outside of it
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Grid item ml={2} mt={2}>
          <Typography variant="h6" mt={2}>
            Selected Records:
          </Typography>

          <Grid item ml={0} mt={3}>
            <BarChart
              width={500}
              height={300}
              data={selectedRecords}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dateField" tickFormatter={formatTime} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="score"
                fill="#B6083550"
                activeBar={<Rectangle fill="#2D9CDB50" stroke="B60835" />}
              />
            </BarChart>
          </Grid>
        </Grid>

        <Grid container justifyContent="flex-end" mt={3}>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Close
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default Chart;
