import React, { useEffect, useState, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./index.css";
import { getScheduleAction } from "../../../redux/schedule/action";
import { useDispatch } from "react-redux";

const DateRangePicker = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [isRange, setIsRange] = useState(true);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Format date to display in input field
  const formatDateShow = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // Format date for API call (ISO format)
  const formatDate = (date, isEndDate = false) => {
    if (isEndDate) {
      // Set time to the end of the day
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      return endOfDay.toISOString();
    }
    const isoString = date.toISOString();
    return isoString.split("T")[0] + "T00:00:00.000Z";
  };

  const handleRangeSelect = (range) => {
    const today = new Date();
    let newStartDate = new Date();
    let newEndDate = new Date();

    switch (range) {
      case "Today":
        newStartDate = today;
        newEndDate = today;
        setIsCustom(false);
        setIsRange(true);
        break;
      case "Yesterday":
        newStartDate = newEndDate = new Date(today.setDate(today.getDate() - 1));
        setIsCustom(false);
        setIsRange(true);
        break;
      case "This Week":
        newStartDate = new Date(today.setDate(today.getDate() - today.getDay()));
        newEndDate = new Date();
        setIsCustom(false);
        setIsRange(true);
        break;
      case "Last 7 days":
        newStartDate = new Date(today.setDate(today.getDate() - 7));
        newEndDate = new Date();
        setIsCustom(false);
        setIsRange(true);
        break;
      case "Last 30 days":
        newStartDate = new Date(today.setDate(today.getDate() - 30));
        newEndDate = new Date();
        setIsCustom(false);
        setIsRange(true);
        break;
      case "This Month":
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newEndDate = new Date();
        setIsCustom(false);
        setIsRange(true);
        break;
      case "Last Month":
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
        setIsCustom(false);
        setIsRange(true);
        break;
      case "Custom":
        setIsCustom(true);
        setIsRange(false);
        setShowDropdown(false);
        return;
      default:
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setShowDropdown(false);

    const payload = {
      startDate: formatDate(newStartDate),
      endDate: formatDate(newEndDate, true),
      type: "Holiday",
      search: "",
    };

    console.log(payload, "date");
    dispatch(getScheduleAction(payload));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const endDateHandler = (date) => {
    setEndDate(date);
    setIsRange(true);
    setIsCustom(false);  // Switch to range selection after selecting the end date

    const payload = {
      startDate: formatDate(startDate),
      endDate: formatDate(date, true),
      type: "Holiday",
      search: "",
    };

    console.log(payload, "date");
    dispatch(getScheduleAction(payload));
  };

  return (
    <div className="date-range-picker">
      {/* Input Field */}
      {isRange && (
        <div
          className="input-container"
          ref={inputRef}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <input
            type="text"
            className="border-0"
            readOnly
            value={`${formatDateShow(startDate)} - ${formatDateShow(endDate)}`}
          />
        </div>
      )}

      {/* Dropdown Options */}
      {showDropdown && (
        <div ref={dropdownRef} className="dropdownn text-center">
          {[
            "Today",
            "Yesterday",
            "This Week",
            "Last 7 days",
            "Last 30 days",
            "This Month",
            "Last Month",
            "Custom",
          ].map((range) => (
            <div key={range} onClick={() => handleRangeSelect(range)}>
              {range}
            </div>
          ))}
        </div>
      )}

      {/* Custom Date Picker */}
      {isCustom && (
        <div className="custom-date-picker py-1 rounded d-flex">
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              if (!endDate) {
                setEndDate(date); // Set end date to start date if not already selected
              }
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="custom-date-input"
          />
          <DatePicker
            selected={endDate}
            onChange={endDateHandler}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            className="custom-date-input"
            disabled={!startDate} // Disable end date if start date is not selected
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
