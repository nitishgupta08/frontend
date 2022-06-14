import React, { useState } from "react";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
} from "@mui/material";

function BoxThree() {
  const [positions, setPositions] = useState(0);
  return (
    <>
      <Typography
        variant="subtitle"
        sx={{ fontSize: "0.9rem", fontWeight: 400 }}>
        My Positions ({positions})
      </Typography>
      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Signal
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Script
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Quantity
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  LTP
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Buy Price
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Sell Price
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle"
                  sx={{ fontSize: "1rem", fontWeight: 600 }}>
                  Net P/L
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Typography
        variant="h1"
        sx={{
          fontSize: "1.3rem",
          fontWeight: 600,
          m: 4,
          textAlign: "center",
        }}>
        Stocks given by the selected strategy will be shown here.
      </Typography>
    </>
  );
}

export default BoxThree;
