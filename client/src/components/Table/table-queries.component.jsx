import React, { useState } from "react";
import { MainButton } from "../Button";
import { DateRange } from "react-date-range";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";

import CloseIcon from "@material-ui/icons/Close";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css f

import { FilterDateBtnsWrapper } from "./table.styles.jsx";

const calendarBtnStyles = {
  height: "40px",
  fontSize: "17px",
  fontFamily: "Arial",
  color: "#0b7c80",
};

const TableQueries = ({
  handleDateFilter,
  globalStartDate,
  globalEndDate,
  note,
}) => {
  const [dates, setDates] = useState({
    startDate: globalStartDate,
    endDate: globalEndDate,
    key: "selection",
  });

  const [state, setState] = useState({
    isDateOpen: false,
    isLoading: false,
  });

  const { isDateOpen, isLoading } = state;

  const handleChange = (item) => {
    setDates(item.selection);
  };

  const handleClick = async () => {
    setState({ ...state, isLoading: true });
    const { startDate, endDate } = dates;
    const start = new Date(startDate).toLocaleDateString("en-CA", {
      timeZone: "UTC",
    });
    const end = new Date(endDate).toLocaleDateString("en-CA", {
      timeZone: "UTC",
    });

    try {
      await handleDateFilter({
        startDate: start,
        endDate: end,
      });
      setState({ ...state, isLoading: false });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: "25px",
        borderBottom: "1px solid",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isDateOpen ? (
          <>
            <DateRange
              editableDateInputs={true}
              onChange={handleChange}
              moveRangeOnFirstSelection={false}
              ranges={[dates]}
            />
            <FilterDateBtnsWrapper>
              <MainButton
                style={{
                  ...calendarBtnStyles,
                  width: "138px",
                  marginLeft: "20px",
                }}
                onClick={handleClick}
              >
                {isLoading ? <LoadingIcon /> : "Filter by Date"}
              </MainButton>
              <MainButton
                style={{ color: "#0b7c80", height: "40px", marginLeft: "20px" }}
                onClick={() => setState({ ...state, isDateOpen: false })}
              >
                <CloseIcon />
              </MainButton>
            </FilterDateBtnsWrapper>
          </>
        ) : (
          <>
            <MainButton
              style={{
                ...calendarBtnStyles,
                width: "151px",
              }}
              onClick={() => setState({ ...state, isDateOpen: true })}
            >
              Open Calendar
            </MainButton>
            <p>{note}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default TableQueries;
