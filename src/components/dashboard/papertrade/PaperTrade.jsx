import React, { useState } from "react";
import { Box, Card } from "@mui/material";
import BoxOne from "./BoxOne";
import BoxTwo from "./BoxTwo";
import BoxThree from "./BoxThree";

function PaperTrade() {
  const [paperMoney, setPaperMoney] = useState(100000);
  return (
    <Box
      component="main"
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
      }}>
      <Box sx={{ display: "flex" }}>
        <Card
          sx={{
            width: "29vw",
            height: "12vw",
            ml: 1,
            p: 2,
            borderRadius: 3,
            boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.1)",
            transition: " all .15s ease-in-out",
          }}>
          <BoxOne paperMoney={paperMoney} />
        </Card>
        <Card
          sx={{
            width: "60vw",
            height: "12vw",
            ml: 2,
            p: 2,

            borderRadius: 3,
            boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.1)",
            transition: " all .15s ease-in-out",
          }}>
          <BoxTwo setPaperMoney={setPaperMoney} />
        </Card>
      </Box>
      <Card
        sx={{
          mt: 2,
          ml: 1,
          p: 2,
          borderRadius: 3,
          boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.1)",
          transition: " all .15s ease-in-out",
        }}>
        <BoxThree />
      </Card>
    </Box>
  );
}

export default PaperTrade;
