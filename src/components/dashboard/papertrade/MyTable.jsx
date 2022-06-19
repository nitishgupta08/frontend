import React, { useEffect, useState } from "react";
import { BaseURL } from "../../../BaseURL";
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@mui/material";

function MyTable({ data }) {
  const [ltp, setLtp] = useState([]);
  console.log(ltp);

  const getLTP = async (value) => {
    const request = { instrument: value };
    fetch(BaseURL + "api/get_ltp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })
      .then((response) => {
        if (response.ok === true) return response.json();
        else {
          throw new Error();
        }
      })
      .then((data) => {
        setLtp(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // LTP is updated every second
  let arr = [];
  useEffect(() => {
    for (let i = 0; i < data.length; i++) {
      arr.push(data[i].name);
    }
    getLTP(arr);
    const interval = setInterval(() => {
      getLTP(arr);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
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
        <TableBody>
          {data.map((row, id) => (
            <TableRow key={row.id}>
              {row.signal === "buy" ? (
                <TableCell sx={{ color: "green" }}>{row.signal}</TableCell>
              ) : (
                <TableCell sx={{ color: "red" }}>{row.signal}</TableCell>
              )}

              <TableCell>{row.name}</TableCell>
              <TableCell>{row.quantity}</TableCell>
              <TableCell>
                {row.buy_price === 0 && ltp.length !== 0
                  ? ltp[id].ltp
                  : row.buy_price}
              </TableCell>
              <TableCell>
                {row.sell_price === 0 && ltp.length !== 0
                  ? ltp[id].ltp
                  : row.sell_price}
              </TableCell>
              {ltp.length !== 0 &&
              (row.sell_price - ltp[id].ltp) * row.quantity < 0 ? (
                <TableCell
                  sx={{ color: "red", fontSize: "1rem", fontWeight: 600 }}>
                  {ltp.length !== 0
                    ? ((row.sell_price - ltp[id].ltp) * row.quantity).toFixed(2)
                    : "-"}
                </TableCell>
              ) : (
                <TableCell
                  sx={{ color: "green", fontSize: "1rem", fontWeight: 600 }}>
                  {ltp.length !== 0
                    ? ((row.sell_price - ltp[id].ltp) * row.quantity).toFixed(2)
                    : "-"}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MyTable;
