import React, { useState, useEffect, useContext } from "react";
import { Tabs, Tab } from "@mui/material";
import { BaseURL } from "../../../BaseURL";
import { UserContext } from "../../../UserContext";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Active from "./Active";
import History from "./History";
import Pending from "./Pending";
import { styled } from "@mui/material/styles";

const LinkTabs = styled((props) => (
  <Tabs
    variant="fullWidth"
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  // marginTop: 20,
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
  fontWeight: 600,
  "&.Mui-selected": {
    transition: "all .15s ease-in-out",
  },
  "&.Mui-focusVisible": {},
}));

function BoxThree({ updateMoney }) {
  const { user } = useContext(UserContext);
  const current = JSON.parse(user);

  const [activeData, setActiveData] = useState([]);
  const [achievedData, setAchievedData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getData = () => {
    const request = {
      username: current.data.username,
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
        setActiveData(
          data.filter((a) => {
            return a.isActive === true && a.isCompleted === false;
          })
        );
        setPendingData(
          data.filter((a) => {
            return a.isActive === false;
          })
        );

        setAchievedData(
          data.filter((a) => {
            return a.isCompleted === true;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      getData();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <LinkTabs value={value} onChange={handleChange}>
        <LinkTab
          pathname="active"
          label={"Active Positions (" + activeData.length + ")"}
        />
        <LinkTab
          pathname="pending"
          label={"Pending Orders (" + pendingData.length + ")"}
        />
        <LinkTab
          pathname="history"
          label={"Day's history (" + achievedData.length + ")"}
        />
      </LinkTabs>
      <Routes>
        <Route
          path="active"
          element={<Active activeData={activeData} updateMoney={updateMoney} />}
        />
        <Route
          path="pending"
          element={
            <Pending pendingData={pendingData} updateMoney={updateMoney} />
          }
        />
        <Route
          path="history"
          element={
            <History achievedData={achievedData} updateMoney={updateMoney} />
          }
        />
        <Route path="*" element={<Navigate to="active" />} />
      </Routes>
    </>
  );
}

export default BoxThree;
