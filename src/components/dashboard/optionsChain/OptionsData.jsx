import React, { useState } from "react";
import { Card, Grid, Snackbar, Alert } from "@mui/material";
import OptionsSettings from "./OptionsSettings";
import OptionsTable from "./OptionsTable";
import CurrentDataCard from "./CurrentDataCard";
import { BaseURL } from "../../../BaseURL";

function OptionsData() {
  const [data, setData] = useState(null);
  const [expiryDates, setExpiryDates] = useState([]);
  const [ltp, setltp] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [current, setCurrent] = useState("");
  const [filter, setFilter] = useState({
    iv: true,
    price: true,
    pChange: true,
    bidAsk: false,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = (val, stock, date) => {
    let request;
    setLoading(true);
    if (val === "") {
      setCurrent(stock);
      request = { symbol: stock, date: date };
    } else {
      setCurrent(val);
      request = { symbol: val, date: date };
    }
    fetch(BaseURL + "api/options_data/", {
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
        setData(data[0]);
        setExpiryDates(data[1]);
        date === "" ? setCurrentDate(data[1][0]) : setCurrentDate(date);
        setltp(Math.round(data[2][0].ltp));
        setLoading(false);
      })
      .catch((error) => {
        setOpen(true);
        console.log(error);
      });
  };

  const snackBarClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={snackBarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity="error" variant="filled">
          Internal Server Error. Please try again later
        </Alert>
      </Snackbar>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.1)",
              transition: " all .15s ease-in-out",
              p: 2,
              ml: 3,
            }}>
            <OptionsSettings
              handleSubmit={handleSubmit}
              expiryDates={expiryDates}
              filter={filter}
              setFilter={setFilter}
              currentDate={currentDate}
              loading={loading}
            />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.1)",
              transition: " all .15s ease-in-out",
              p: 2,
              ml: 1,
            }}>
            <CurrentDataCard ltp={ltp} current={current} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0px 0px 10px 5px rgba(0,0,0,0.1)",
              transition: " all .15s ease-in-out",
              p: 2,
              mb: 3,
              ml: 3,
            }}>
            <OptionsTable data={data} ltp={ltp} filter={filter} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default OptionsData;
