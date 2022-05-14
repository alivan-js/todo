import { Grid, Typography } from "@mui/material";
import React from "react";

export const NotFound = () => {
  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <Typography variant="h1" align="center">
          404
        </Typography>
        <Typography variant="h6" align="center">
          Ooooops!
        </Typography>
        <Typography variant="h6" align="center">
          THAT PAGE DOESN'T EXIST OR UNAVAILABLE
        </Typography>
      </Grid>
    </Grid>
  );
};
