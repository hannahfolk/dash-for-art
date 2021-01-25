import React, { useState, } from "react";
import { DateRange } from "react-date-range";

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file

const DatePicker = () => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);


  const handleChange = (item) => {
    console.log(item);
    setState([item.selection])
  }

  return (
    <DateRange
      editableDateInputs={true}
      onChange={handleChange}
      moveRangeOnFirstSelection={false}
      ranges={state}
    />
  );
};

export default DatePicker;
