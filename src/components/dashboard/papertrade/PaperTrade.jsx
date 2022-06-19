import React, { useState } from "react";
import { Box, Card } from "@mui/material";
import BoxOne from "./BoxOne";
import BoxTwo from "./BoxTwo";
import BoxThree from "./BoxThree";

function PaperTrade() {
  //https://stackoverflow.com/questions/16037165/displaying-a-number-in-indian-format-using-javascript
  let x = 100000;
  x = x.toString();
  let lastThree = x.substring(x.length - 3);
  let otherNumbers = x.substring(0, x.length - 3);
  if (otherNumbers !== "") lastThree = "," + lastThree;
  let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  const [paperMoney, setPaperMoney] = useState(res);

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
          <BoxTwo />
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
        <BoxThree setPaperMoney={setPaperMoney} />
      </Card>
    </Box>
  );
}

export default PaperTrade;
