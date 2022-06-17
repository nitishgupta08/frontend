import React, { useState, useEffect } from "react";
import {
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Button,
  TextField,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { BaseURL } from "../../../BaseURL";

function BoxTwo({ setPaperMoney }) {
  const [strategies, setStrategies] = useState([]);

  // dropdown states
  const [current, setCurrent] = React.useState({ strategy: "", money: 0 });
  const handleChange = (event) => {
    setCurrent({ ...current, strategy: event.target.value });
  };

  const [submit, setSubmit] = useState(false);
  const handleSubmit = () => {
    //https://stackoverflow.com/questions/16037165/displaying-a-number-in-indian-format-using-javascript
    let x = current.money;
    x = x.toString();
    let lastThree = x.substring(x.length - 3);
    let otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== "") lastThree = "," + lastThree;
    let res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

    setPaperMoney(res);
    setSubmit(!submit);
  };

  useEffect(() => {
    fetch(BaseURL + "api/strategies/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        setStrategies(data);
      })
      .catch((error) => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Box>
        <Typography
          variant="subtitle"
          sx={{ fontSize: "0.9rem", fontWeight: 400 }}>
          Settings
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 3,
          }}>
          <FormControl disabled={submit}>
            <InputLabel id="demo-simple-select-autowidth-label">
              Strategy
            </InputLabel>
            <Select
              sx={{ minWidth: 120 }}
              labelid="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={current.strategy}
              label="Strategy"
              autoWidth
              onChange={handleChange}>
              {strategies.map((data, i) => {
                return (
                  <MenuItem value={data.id} key={i}>
                    {data.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Typography
            variant="subtitle"
            sx={{ fontSize: "1rem", fontWeight: 400, ml: 2 }}>
            <ArrowForwardIcon />
          </Typography>
          {/* <TextField
            disabled={submit}
            required
            label="Amount you want to spend"
            type="text"
            name="Money"
            value={current.money}
            onChange={(e) => setCurrent({ ...current, money: e.target.value })}
            sx={{ ml: 2, width: 250 }}
          />
          <Typography
            variant="subtitle"
            sx={{ fontSize: "1rem", fontWeight: 400, ml: 2 }}>
            <ArrowForwardIcon />
          </Typography> */}
          {!submit ? (
            <Button
              type="submit"
              variant="contained"
              sx={{ ml: 2, height: 55 }}
              onClick={handleSubmit}>
              Execute
            </Button>
          ) : (
            <Button
              type="submit"
              variant="contained"
              sx={{
                ml: 2,
                height: 55,
                backgroundColor: "red",
                "&:hover": {
                  backgroundColor: "#FF2E2E",
                  color: "#ffff",
                },
              }}
              onClick={handleSubmit}>
              Stop Execution
            </Button>
          )}
        </Box>
      </Box>
    </>
  );
}

export default BoxTwo;
