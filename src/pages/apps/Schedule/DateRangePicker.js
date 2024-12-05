import React, { useEffect, useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';
import { getScheduleAction } from '../../../redux/schedule/action';
import { useDispatch } from 'react-redux';

const DateRangePicker = () => {
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const formatDateShow = (date) => {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  };

  const formattedStartDate = formatDateShow(startDate); // Example: "4/12/2024"
  const formattedEndDate = formatDateShow(endDate);  // Example: "4/12/2024"

  const formatDate = (date) => {
    const isoString = date.toISOString(); // Convert to ISO string
    return isoString.split('T')[0] + 'T00:00:00.000'; // Get date part and append time
  };

  const handleRangeSelect = (range) => {
    const today = new Date();
    let newStartDate = new Date();
    let newEndDate = new Date();

    switch (range) {
      case 'Today':
        newStartDate = newEndDate = today;
        setIsCustom(false);

        break;
      case 'Yesterday':
        newStartDate = newEndDate = new Date(today.setDate(today.getDate() - 1));
        setIsCustom(false);

        break;
      case 'This Week':
        newStartDate = new Date(today.setDate(today.getDate() - today.getDay()));
        newEndDate = new Date();
        setIsCustom(false);

        break;
      case 'Last 7 days':
        newStartDate = new Date(today.setDate(today.getDate() - 7));
        newEndDate = new Date();
        setIsCustom(false);

        break;
      case 'Last 30 days':
        newStartDate = new Date(today.setDate(today.getDate() - 30));
        newEndDate = new Date();
        setIsCustom(false);

        break;
      case 'This Month':
        newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
        newEndDate = new Date();
        setIsCustom(false);

        break;
      case 'Last Month':
        newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
        setIsCustom(false);
        break;
      case 'Custom':
        setIsCustom(true);
        setShowDropdown(false);
        return;
      default:
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setShowDropdown(false);

    // Dispatch the payload
    const payload = {
      startDate: formatDate(newStartDate),
      endDate: formatDate(newEndDate),
      flag: "Holiday",
      search : ''
    };
    dispatch(getScheduleAction(payload));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  return (
    <div className="date-range-picker">
      {/* Input Field */}
      <div className="input-container" ref={inputRef} onClick={() => setShowDropdown(!showDropdown)}>
        <input
          type="text"
          className="border-0"
          readOnly
          value={`${formattedStartDate} - ${formattedEndDate}`}
        />
      </div>

      {/* Dropdown Options */}
      {showDropdown && (
        <div ref={dropdownRef} className="dropdownn text-center">
          {['Today', 'Yesterday', 'This Week', 'Last 7 days', 'Last 30 days', 'This Month', 'Last Month', 'Custom'].map((range) => (
            <div key={range} onClick={() => handleRangeSelect(range)}>
              {range}
            </div>
          ))}
        </div>
      )}

      {/* Custom Date Picker */}
      {isCustom && (
        <div className="custom-date-picker border-0">
          <DatePicker
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              console.log("Custom Start Date Selected:", date);
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="custom-date-input"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              console.log("Custom End Date Selected:", date);
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            className="custom-date-input"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
