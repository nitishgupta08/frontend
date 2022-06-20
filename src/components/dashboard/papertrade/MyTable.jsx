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

function compare(a, b) {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
}

function MyTable({ data, updateMoney }) {
  data.sort(compare);
  const [ltp, setLtp] = useState([]);

  var turnover = 0;

  var stt = 0;
  const turnoverArr = data.map((row, id) => {
    if (row.signal === "BUY") {
      turnover =
        (row.buy_price + (ltp.length !== 0 ? ltp[id].ltp : 0)) * row.quantity;
    } else {
      turnover =
        (row.sell_price + (ltp.length !== 0 ? ltp[id].ltp : 0)) * row.quantity;
    }
    return turnover;
  });

  const sttprice = data.map((row, id) => {
    if (row.signal === "BUY") {
      stt = (ltp.length !== 0 ? ltp[id].ltp : 0) * row.quantity * 0.00025;
    } else {
      stt = row.sell_price * row.quantity * 0.00025;
    }
    return stt;
  });
  const brokerage = turnoverArr.map((item) => Math.min(item * 0.0001, 40));
  const tranCharges = turnoverArr.map((item) => item * 0.0000325);
  const sebiCharges = turnoverArr.map((item) => item * 0.000002);
  const stampDuty = turnoverArr.map((item) => item * 0.0001);
  const serviceTax = brokerage.map(
    (item, id) => (item + tranCharges[id]) * 0.15
  );

  var totalcharge = 0;
  const totalCharges = brokerage.map((item, id) => {
    totalcharge =
      item +
      tranCharges[id] +
      sebiCharges[id] +
      stampDuty[id] +
      serviceTax[id] +
      sttprice[id];
    return totalcharge;
  });

  var total = 0;
  var stockNetpl = 0;
  const netPL = data.map((row, id) => {
    if (row.signal === "BUY") {
      total +=
        (row.buy_price - (ltp.length !== 0 ? ltp[id].ltp : 0)) * row.quantity -
        totalCharges[id];
      stockNetpl =
        (row.buy_price - (ltp.length !== 0 ? ltp[id].ltp : 0)) * row.quantity -
        totalCharges[id];
    } else {
      total +=
        (row.sell_price - (ltp.length !== 0 ? ltp[id].ltp : 0)) * row.quantity -
        totalCharges[id];
      stockNetpl =
        (row.sell_price - (ltp.length !== 0 ? ltp[id].ltp : 0)) * row.quantity -
        totalCharges[id];
    }

    return stockNetpl;
  });

  useEffect(() => {
    updateMoney((data.length * 100000 + total).toFixed(2));
  }, [data.length, total, updateMoney]);

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
      .then((temp) => {
        setLtp(temp);
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
            <TableCell>
              <Typography
                variant="subtitle"
                sx={{ fontSize: "1rem", fontWeight: 600 }}>
                Total Charges
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, id) => (
            <TableRow key={row.id}>
              {row.signal === "BUY" ? (
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

              {netPL[id] < 0 ? (
                <TableCell
                  sx={{ color: "red", fontSize: "1rem", fontWeight: 600 }}>
                  {ltp.length !== 0 && netPL[id].toFixed(2)}
                </TableCell>
              ) : (
                <TableCell
                  sx={{ color: "green", fontSize: "1rem", fontWeight: 600 }}>
                  {ltp.length !== 0 && netPL[id].toFixed(2)}
                </TableCell>
              )}
              <TableCell>{totalCharges[id].toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow hover>
            <TableCell colSpan={4} />
            <TableCell>
              <Typography
                variant="subtitle"
                sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                Total
              </Typography>
            </TableCell>
            <TableCell sx={{ fontSize: "1.2rem", fontWeight: 600 }} colSpan={2}>
              ₹ {total.toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default MyTable;
