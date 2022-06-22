import React, { useState, useEffect, useContext } from "react";
import { Typography, Tabs, Tab } from "@mui/material";
import { BaseURL } from "../../../BaseURL";
import { UserContext } from "../../../UserContext";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Active from "./Active";
import Achieved from "./Achieved";
import { styled } from "@mui/material/styles";
// import MyTable1 from "./MyTable1";

const LinkTabs = styled((props) => (
  <Tabs
    variant="fullWidth"
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  marginTop: 20,
  opacity: 1,
  "& .MuiTabs-indicator": {
    display: "none",
  },
  "& .MuiTabs-indicatorSpan": {
    display: "none",
  },
});

const LinkTab = styled((props) => (
  <Tab
    disableRipple
    component={Link}
    to={props.pathname}
    icon={props.icon}
    {...props}
  />
))(({ theme }) => ({
  borderRadius: 3,
  color: "text.primary",
  marginBottom: 1,
  "&.Mui-selected": {
    backgroundColor: "#874cf7",
    color: "#fff",
    transition: "all .15s ease-in-out",
  },
  "&.Mui-focusVisible": {},
}));

function BoxThree({ updateMoney }) {
  const { user } = useContext(UserContext);
  const current = JSON.parse(user);
  const [activeData, setActiveData] = useState([]);
  const [achievedData, setAchievedData] = useState([]);
  console.log(activeData);
  console.log(achievedData);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getActiveData = () => {
    const request = {
      username: current.data.username,
      isCompleted: false,
    };
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
      .then((activeData) => {
        setActiveData(activeData);
        updateMoney(100000 * activeData.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getAchievedData = () => {
    const request = {
      username: current.data.username,
      isCompleted: true,
    };
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
        setAchievedData(data);
        // updateMoney(100000 * activeData.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //Fetching activeData and achievedData every 5 secs
  useEffect(() => {
    getActiveData();
    getAchievedData();
    const interval = setInterval(() => {
      getActiveData();
      getAchievedData();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LinkTabs value={value} onChange={handleChange}>
        <LinkTab pathname="active" label="Active Positions" />
        <LinkTab pathname="achieved" label="Achieved Positions" />
      </LinkTabs>

      {activeData.length === 0 ? (
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
        <Routes>
          <Route
            path="active"
            element={
              <Active activeData={activeData} updateMoney={updateMoney} />
            }
          />
          <Route
            path="achieved"
            element={<Achieved achievedData={achievedData} />}
          />

          <Route path="*" element={<Navigate to="active" />} />
        </Routes>
      )}
    </>
  );
}

export default BoxThree;
