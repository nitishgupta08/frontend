import React, { useState, useEffect, useContext } from "react";
import { Typography } from "@mui/material";
import { BaseURL } from "../../../BaseURL";
import { UserContext } from "../../../UserContext";
import MyTable from "./MyTable";
// import MyTable1 from "./MyTable1";

function BoxThree({ updateMoney }) {
  const { user } = useContext(UserContext);
  const current = JSON.parse(user);
  const [positions, setPositions] = useState(0);
  const [data, setData] = useState([]);
  // console.log(data);

  const getData = () => {
    const request = { username: current.data.username };
    fetch(BaseURL + "api/get_trades/", {
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
        setData(data);
        setPositions(data.length);
        updateMoney(100000 * data.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Fetching data every 5 secs
  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography
        variant="subtitle"
        sx={{ fontSize: "0.9rem", fontWeight: 400 }}>
        My Positions ({positions})
      </Typography>
      {data.length === 0 ? (
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
      ) : (
        <MyTable data={data} updateMoney={updateMoney} />
        // <MyTable1 data={data} updateMoney={updateMoney} />
      )}
    </>
  );
}

export default BoxThree;
