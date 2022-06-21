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
  const [ltp, setLtp] = useState(Array(data.length).fill({ ltp: 0 }));
  const [total, setTotal] = useState(0);
  const [netPL, setNetPL] = useState(Array(data.length).fill(0));
  const [totalCharges, setTotalCharges] = useState(Array(data.length).fill(0));
  console.log(ltp);
  const getLTP = async () => {
    // setLtp(resize(ltp, 82, { ltp: 0 }));
    const arr = data.map((item) => item.name);
    const request = { instrument: arr };
    const response = await fetch(BaseURL + "api/get_ltp/", {
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
      .catch((error) => {
        console.log(error);
      });
    setLtp(response);
    var [netPL, totalCharges, total] = updateTable(data, response);
    setTotal(total);
    setNetPL(netPL);
    setTotalCharges(totalCharges);
  };

  // LTP is updated every second
  useEffect(() => {
    getLTP();
    const interval = setInterval(() => {
      getLTP();
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    updateMoney((data.length * 100000 + total).toFixed(2));
  }, [data.length, total, updateMoney]);

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
                {row.buy_price === 0
                  ? ltp.length !== data.length
                    ? 0
                    : ltp[id].ltp
                  : row.buy_price}
              </TableCell>
              <TableCell>
                {row.sell_price === 0
                  ? ltp.length !== data.length
                    ? 0
                    : ltp[id].ltp
                  : row.sell_price}
              </TableCell>
              {netPL[id] < 0 ? (
                <TableCell
                  sx={{ color: "red", fontSize: "1rem", fontWeight: 600 }}>
                  {netPL[id] === undefined ? 0 : netPL[id].toFixed(2)}
                </TableCell>
              ) : (
                <TableCell
                  sx={{ color: "green", fontSize: "1rem", fontWeight: 600 }}>
                  {netPL[id] === undefined ? 0 : netPL[id].toFixed(2)}
                </TableCell>
              )}
              <TableCell>
                {totalCharges[id] === undefined
                  ? 0
                  : totalCharges[id].toFixed(2)}
              </TableCell>
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

const updateTable = (data, ltp) => {
  var turnover = 0;
  var stt = 0;
  const turnoverArr = data.map((row, id) => {
    if (row.signal === "BUY") {
      turnover = (row.buy_price + ltp[id].ltp) * row.quantity;
    } else {
      turnover = (row.sell_price + ltp[id].ltp) * row.quantity;
    }
    return turnover;
  });

  const sttprice = data.map((row, id) => {
    if (row.signal === "BUY") {
      stt = ltp[id].ltp * row.quantity * 0.00025;
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
      total += (ltp[id].ltp - row.buy_price) * row.quantity - totalCharges[id];
      stockNetpl =
        (ltp[id].ltp - row.buy_price) * row.quantity - totalCharges[id];
    } else {
      total += (row.sell_price - ltp[id].ltp) * row.quantity - totalCharges[id];
      stockNetpl =
        (row.sell_price - ltp[id].ltp) * row.quantity - totalCharges[id];
    }

    return stockNetpl;
  });

  return [netPL, totalCharges, total];
};

export default MyTable;
