/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";

import Tooltip from "@mui/material/Tooltip";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LockIcon from '@mui/icons-material/Lock';

import "./AvailabilityCalendar.scss";
import "react-datepicker/dist/react-datepicker.css";
import "react-multi-carousel/lib/styles.css";

import { bookingInfoActions } from "../../states/BookingInfo";
import { firebaseAuth } from "../../firebaseConfig.js";

export default function AvailabilityCalendar({ hallData }) {
  const timeSlots = {
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
    13: false,
    14: false,
    15: false,
    16: false,
    17: false,
    18: false,
    19: false,
    20: false,
    21: false,
    22: false,
    23: false,
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
  };
  const calendar = {
    Monday: { date: "", timeSlots: { ...timeSlots } },
    Tuesday: { date: "", timeSlots: { ...timeSlots } },
    Wednesday: { date: "", timeSlots: { ...timeSlots } },
    Thursday: { date: "", timeSlots: { ...timeSlots } },
    Friday: { date: "", timeSlots: { ...timeSlots } },
    Saturday: { date: "", timeSlots: { ...timeSlots } },
    Sunday: { date: "", timeSlots: { ...timeSlots } },
  };
  const [availabilityCalendar, setAvailabilityCalendar] = useState(calendar);
  const containerRef = useRef(null);
  const [startDate, setStartDate] = useState(new Date());
  const [startDateOfWeek, setStartDateOfWeek] = useState(null);
  const [endDateOfWeek, setEndDateOfWeek] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); //user login status

  const dispatch = useDispatch();
  const bookingInfoStore = useSelector((state) => state.bookingInfo);
  const userInfoStore = useSelector((state) => state.userInfo);

  const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    const startOfWeekDate = new Date(d.setDate(diff));
    startOfWeekDate.setHours(0, 0, 0, 0); // Set time to 23:59:59.999
    return startOfWeekDate;
  };

  const endOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? 0 : 7); // Adjust for Sunday
    const endOfWeekDate = new Date(d.setDate(diff));
    endOfWeekDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
    return endOfWeekDate;
  };

  function getDayOfWeek(date) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = new Date(date).getDay();
    return daysOfWeek[dayIndex];
  }

  function getFormattedDate(date) {
    // returns YYYY-MM-DD
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  }

  const setDates = async (startDateOfWeek, endDateOfWeek) => {
    const updatedCalendar = { ...availabilityCalendar };
    const currentDate = new Date(startDateOfWeek);

    while (currentDate <= endDateOfWeek) {
      const formattedDate = currentDate.toLocaleDateString("en-GB"); // Format: "dd/mm/yyyy"
      const dayOfWeek = currentDate.toLocaleDateString("en-US", {
        weekday: "long",
      });

      if (Object.prototype.hasOwnProperty.call(updatedCalendar, dayOfWeek)) {
        updatedCalendar[dayOfWeek].date = formattedDate;
      }

      currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
    }

    setAvailabilityCalendar(updatedCalendar);
  };

  const getAvailability = async () => {
    try {
      if (startDateOfWeek && endDateOfWeek) {
        const response = await axios.get(
          `http://localhost:8000/eventify_server/hallBookingMaster/getHallAvailability?hallId=${hallData._id}&startDate=${startDateOfWeek}&endDate=${endDateOfWeek}`
        );
        console.log(response.data);
        const bookings = response.data;
        if (bookings) {
          bookings.map((booking) => {
            const tempCalendar = { ...availabilityCalendar };
            const bookingStartDateTimestamp = new Date(
              booking.bookingStartDateTimestamp
            );
            const bookingEndDateTimestamp = new Date(
              booking.bookingEndDateTimestamp
            );
            const bookingStartDate = new Date(
              bookingStartDateTimestamp.getTime() - 5.5 * 60 * 60 * 1000
            ); // to UTC time
            const bookingEndDate = new Date(
              bookingEndDateTimestamp.getTime() - 5.5 * 60 * 60 * 1000
            ); // to UTC time
            console.log(
              "BOOKING START and END DATES ",
              bookingStartDate.toString(),
              bookingEndDate.toString()
            );
            console.log(
              "BOOKING START and END DATES ",
              startDateOfWeek.toString(),
              endDateOfWeek.toString()
            );

            if (
              bookingStartDate < startDateOfWeek &&
              bookingEndDate > endDateOfWeek
            ) {
              console.log("DEBUGGING_1: ");
              // Case 1: Booking spans over the whole week
              for (const day in tempCalendar) {
                tempCalendar[day].timeSlots = Object.fromEntries(
                  Object.entries(tempCalendar[day].timeSlots).map(
                    ([timeSlot, _]) => [timeSlot, true]
                  )
                );
              }
              setAvailabilityCalendar(tempCalendar);
            } else if (
              bookingStartDate >= startDateOfWeek &&
              bookingEndDate > endDateOfWeek
            ) {
              console.log("DEBUGGING_2: ");
              // Case 2: Booking starts within the week but extends beyond it
              const bookingStartDD = bookingStartDate.getDate();
              const endOfWeekDD = endDateOfWeek.getDate();

              for (let i = 0; i <= endOfWeekDD - bookingStartDD; i++) {
                const date = new Date(
                  bookingStartDate.getTime() + i * 24 * 60 * 60 * 1000
                );
                const day = getDayOfWeek(date);
                if (i === 0) {
                  const bookingStHour = bookingStartDate.getHours();
                  for (let hour = bookingStHour; hour <= 23; hour++) {
                    tempCalendar[day].timeSlots[hour] = true;
                  }
                } else {
                  tempCalendar[day].timeSlots = Object.fromEntries(
                    Object.entries(tempCalendar[day].timeSlots).map(
                      ([timeSlot, _]) => [timeSlot, true]
                    )
                  );
                }
              }
              setAvailabilityCalendar(tempCalendar);
            } else if (
              bookingStartDate < startDateOfWeek &&
              bookingEndDate <= endDateOfWeek
            ) {
              console.log("DEBUGGING_3: ");
              // Case 3: Booking ends within the week but starts before it
              const bookingEndDD = bookingEndDate.getDate();
              const startOfWeekDD = startDateOfWeek.getDate();

              for (let i = startOfWeekDD; i <= bookingEndDD; i++) {
                const date = new Date(
                  startDateOfWeek.getTime() +
                    (i - startOfWeekDD) * 24 * 60 * 60 * 1000
                );
                const day = getDayOfWeek(date);

                if (i === bookingEndDD) {
                  const bookingEndHour = bookingEndDate.getHours();
                  for (let hour = 0; hour < bookingEndHour; hour++) {
                    tempCalendar[day].timeSlots[hour] = true;
                  }
                } else {
                  tempCalendar[day].timeSlots = Object.fromEntries(
                    Object.entries(tempCalendar[day].timeSlots).map(
                      ([timeSlot, _]) => [timeSlot, true]
                    )
                  );
                }
              }
              setAvailabilityCalendar(tempCalendar);
            } else {
              // Case 4: Booking falls entirely within the week
              const startDD = bookingStartDate.getDate();
              const endDD = bookingEndDate.getDate();
              const startOfWeekDD = startDateOfWeek.getDate();
              const endOfWeekDD = endDateOfWeek.getDate();

              console.log("DEBUGGING_4 : ", startDD, endDD);
              console.log(startDateOfWeek, endDateOfWeek);
              // console.log(formattedStartDateOfWeek, formattedEndDateOfWeek);
              console.log(bookingStartDate, bookingEndDate);

              if (startDD === endDD) {
                const bookingStartHour = bookingStartDate.getHours();
                const bookingEndHour = bookingEndDate.getHours();
                const day = getDayOfWeek(bookingStartDate);
                for (
                  let hour = bookingStartHour;
                  hour < bookingEndHour;
                  hour++
                ) {
                  tempCalendar[day].timeSlots[hour] = true;
                }
              } else {
                for (let i = startOfWeekDD; i <= endOfWeekDD; i++) {
                  const date = new Date(
                    startDateOfWeek.getTime() +
                      (i - startOfWeekDD) * 24 * 60 * 60 * 1000
                  );
                  const day = getDayOfWeek(date);

                  if (i === startDD) {
                    const bookingStartHour = bookingStartDate.getHours();
                    for (let hour = bookingStartHour; hour <= 23; hour++) {
                      tempCalendar[day].timeSlots[hour] = true;
                    }
                  } else if (i === endDD) {
                    const bookingEndHour = bookingEndDate.getHours();
                    for (let hour = 0; hour < bookingEndHour; hour++) {
                      tempCalendar[day].timeSlots[hour] = true;
                    }
                  } else {
                    tempCalendar[day].timeSlots = Object.fromEntries(
                      Object.entries(tempCalendar[day].timeSlots).map(
                        ([timeSlot, _]) => [timeSlot, true]
                      )
                    );
                  }
                }
              }
              setAvailabilityCalendar(tempCalendar);
            }
          });
        }
        console.log("AVAILABILITY CALENDAR", availabilityCalendar);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  function parseDate(dateString, splitCriteria) {
    if (splitCriteria === "/") {
      // DD/MM/YYYY
      const parts = dateString.split("/");
      // Month is 0-based, so we subtract 1 from the month value
      return new Date(parts[2], parts[1] - 1, parts[0]);
    } else if (splitCriteria === "-") {
      // YYYY-MM-DD
      const parts = dateString.split("-");
      // Month is 0-based, so we subtract 1 from the month value
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }

  // Function to compare if a date lies between a start date and an end date
  function isDateInRange(date, startDate, endDate) {
    const parsedDate = parseDate(date, "/");
    const parsedStartDate = parseDate(startDate, "-");
    const parsedEndDate = parseDate(endDate, "-");

    // Check if the date is greater than or equal to the start date
    // and less than or equal to the end date
    return parsedDate >= parsedStartDate && parsedDate <= parsedEndDate;
  }

  const formatBookingDate = (date) => {
    // yyyy-mm-dd to dd/mm/yyyy
    const [year, month, day] = date.split("-");
    return `${day}/${month}/${year}`;
  };

  const formatDate = (date) => {
    // new Date()  to  dd/mm/yyyy
    const dateObject = new Date(date);
    const day = String(dateObject.getDate()).padStart(2, "0");
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const year = dateObject.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatBookingTime = (time) => {
    // returns only the hour
    const [HH, MM] = time.split(":");
    return parseInt(`${HH}`);
  };

  const isSelectedSlot = (currentDate, timeSlot) => {
    if (!bookingInfoStore.startTime || !bookingInfoStore.endTime) {
      return;
    }
    const formattedStartTime = formatBookingTime(bookingInfoStore.startTime);
    const formattedEndTime = formatBookingTime(bookingInfoStore.endTime);

    //check if the time slots fall under the start and end time
    if (currentDate === formatBookingDate(bookingInfoStore.bookingStartDate)) {
      if (currentDate !== formatBookingDate(bookingInfoStore.bookingEndDate)) {
        return timeSlot >= formattedStartTime;
      } else {
        return timeSlot >= formattedStartTime && timeSlot < formattedEndTime;
      }
    } else if (
      currentDate === formatBookingDate(bookingInfoStore.bookingEndDate)
    ) {
      return timeSlot < formattedEndTime;
    } else {
      return true;
    }
  };

  useEffect(() => {
    if (startDate) {
      console.log("CHECK0" + startDate);
      setStartDateOfWeek(startOfWeek(startDate));
      setEndDateOfWeek(endOfWeek(startDate));
    }
  }, [startDate]);

  useEffect(() => {
    if (startDateOfWeek && endDateOfWeek) {
      console.log("CHECK" + startDateOfWeek, endDateOfWeek);
      setDates(startDateOfWeek, endDateOfWeek);
      getAvailability();
    }
  }, [startDateOfWeek, endDateOfWeek]);

  // to fetch the data when the start date changes... condition written to check whether startDate lies in the same week... if so no need to refetch
  useEffect(() => {
    try {
      const bookingStartDate = bookingInfoStore.bookingStartDate;
      if (!bookingStartDate) {
        const [dd, mm, yyyy] = formatDate(startDate).split("/");
        dispatch(bookingInfoActions("bookingStartDate", `${yyyy}-${mm}-${dd}`));
        dispatch(
          bookingInfoActions("bookingStartDay", getDayOfWeek(startDate))
        );
        dispatch(bookingInfoActions("bookingEndDate", `${yyyy}-${mm}-${dd}`));
        dispatch(bookingInfoActions("bookingEndDay", getDayOfWeek(startDate)));

        return;
      }
      //  to dd/mm/yyyy
      const newFormatBookingStartDate = formatBookingDate(bookingStartDate);
      for (const day in availabilityCalendar) {
        if (availabilityCalendar[day].date === newFormatBookingStartDate) {
          return;
        }
      }
      setStartDate(bookingInfoStore.bookingStartDate);
    } catch (error) {
      console.error(error.message);
    }
  }, [bookingInfoStore.bookingStartDate]);

  // to calculate the booking duration of a booking
  useEffect(() => {
    if (!bookingInfoStore.startTime || !bookingInfoStore.endTime) {
      return;
    }
    try {
      // code to calculate the different between the time slots
      // Parse the start time and end time strings into Date objects
      const startDate = new Date(
        `${bookingInfoStore.bookingStartDate}T${bookingInfoStore.startTime}:00`
      );
      const endDate = new Date(
        `${bookingInfoStore.bookingEndDate}T${bookingInfoStore.endTime}:00`
      );
      console.log("DATES : ", startDate, endDate);
      // Calculate the time difference in milliseconds
      let timeDifference = endDate - startDate;
      console.log("TIME : ", timeDifference);

      const timeDifferenceMilliseconds = endDate - startDate;
      const timeDifferenceHours = Math.floor(
        timeDifferenceMilliseconds / (1000 * 60 * 60)
      );
      const timeDifferenceMinutes = Math.floor(
        (timeDifferenceMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
      );

      console.log(
        `Time difference: ${timeDifferenceHours} hours ${timeDifferenceMinutes} minutes`
      );

      // Format the time difference into a string representation
      const timeDifferenceStr = `${timeDifferenceHours.toString()}:${timeDifferenceMinutes.toString()}`;

      dispatch(bookingInfoActions("bookingDuration", timeDifferenceStr));

      // code to check whether the chosen time range is appropriate or not
      if (
        bookingInfoStore.endTime === "00:00" &&
        bookingInfoStore.bookingStartDate === bookingInfoStore.bookingEndDate
      ) {
        dispatch(
          bookingInfoActions(
            "errorInfo",
            "Invalid Time Range: Please select a valid time range."
          )
        );
      } else {
        dispatch(bookingInfoActions("errorInfo", ""));
      }

      // to check whether the booking overlaps with any existing ones
      const checkBookingSlotAvailability = async () => {
        //clear any previous comments
        dispatch(bookingInfoActions("comments", ""));

        // code to check if there are any clashes with the existing bookings
        const parsedStartDateObject = parseDate(
          bookingInfoStore.bookingStartDate,
          "-"
        );
        const parsedEndDateObject = parseDate(
          bookingInfoStore.bookingEndDate,
          "-"
        );
        parsedStartDateObject.setHours(
          parseInt(bookingInfoStore.startTime.split(":")[0]),
          0,
          0,
          0
        );
        parsedEndDateObject.setHours(
          parseInt(bookingInfoStore.endTime.split(":")[0]),
          0,
          0,
          0
        );

        const response = await axios.get(
          `http://localhost:8000/eventify_server/hallBookingMaster/getHallBookings/?hallId=${hallData._id}&bookingStartDateTimestamp=${parsedStartDateObject}&bookingEndDateTimestamp=${parsedEndDateObject}`
        );

        const bookings = response.data;
        console.log("Bookings: ", response.data);
        console.log("BOOKINGS : ", bookings.count);
        if (bookings.count !== 0) {
          dispatch(
            bookingInfoActions(
              "errorInfo",
              "Sorry, This slot is already booked. Please choose a different slot to continue."
            )
          );
          return;
        } else {
          dispatch(
            bookingInfoActions(
              "comments",
              "This slot is available! You can proceed with your booking."
            )
          );
          return;
        }
      };

      checkBookingSlotAvailability();
    } catch (error) {
      console.error(error.message);
    }
  }, [
    bookingInfoStore.bookingStartDate,
    bookingInfoStore.bookingEndDate,
    bookingInfoStore.startTime,
    bookingInfoStore.endTime,
  ]);

  useEffect(()=> {
    try {
      const currentUser = firebaseAuth.currentUser;
      if (currentUser) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  }, [userInfoStore.userAuthStateChangeFlag]);

  const handlePrevWeek = () => {
    setAvailabilityCalendar(calendar);
    setStartDate((prevStartDate) => {
      const newStartDate = new Date(prevStartDate);
      newStartDate.setDate(newStartDate.getDate() - 7);
      return newStartDate;
    });
  };

  const handleNextWeek = () => {
    setAvailabilityCalendar(calendar);
    setStartDate((prevStartDate) => {
      const newStartDate = new Date(prevStartDate);
      newStartDate.setDate(newStartDate.getDate() + 7);
      return newStartDate;
    });
  };

  const handleDateChange = (date, day) => {
    const [dd, mm, yyyy] = date.split("/");
    dispatch(bookingInfoActions("bookingStartDate", `${yyyy}-${mm}-${dd}`));
    dispatch(bookingInfoActions("bookingStartDay", day));

    dispatch(bookingInfoActions("bookingEndDate", `${yyyy}-${mm}-${dd}`));
    dispatch(bookingInfoActions("bookingEndDay", day));
  };

  const handleTimeChange = (time, isBooked) => {
    const endTime = parseInt(time) < 23 ? parseInt(time) + 1 : "00";

    dispatch(
      bookingInfoActions("startTime", `${time.toString().padStart(2, "0")}:00`)
    );

    dispatch(
      bookingInfoActions("endTime", `${endTime.toString().padStart(2, "0")}:00`)
    );
  };

  return (
    <div className="availabilityCalendar__wrapper">
      <h2 className="heading">Availability Calendar</h2>
      <div className="contents__wrapper">
        <div className="seven-day-date-picker">
          <div className="arrow" onClick={handlePrevWeek}>
            <FaChevronLeft className="icon" />
          </div>
          <div className="date-range">
            <span>
              {startDateOfWeek
                ? startDateOfWeek.getDate().toString().padStart(2, "0") +
                  "/" +
                  (startDateOfWeek.getMonth() + 1).toString().padStart(2, "0") +
                  "/" +
                  startDateOfWeek.getFullYear().toString()
                : ""}
            </span>
            <span className="date-separator">-</span>
            <span>
              {endDateOfWeek
                ? endDateOfWeek.getDate().toString().padStart(2, "0") +
                  "/" +
                  (endDateOfWeek.getMonth() + 1).toString().padStart(2, "0") +
                  "/" +
                  endDateOfWeek.getFullYear().toString()
                : ""}
            </span>
          </div>
          <div className="arrow" onClick={handleNextWeek}>
            <FaChevronRight className="icon" />
          </div>
        </div>
        <>
          {isUserLoggedIn ? (
            <div className="calendar">
              <div className="days__wrapper">
                <div className="sub-wrapper">
                  <div className="sub-title" style={{ visibility: "hidden" }}>
                    Hours
                  </div>
                  <div className="title" style={{ visibility: "hidden" }}>
                    Hours
                  </div>
                </div>
                {availabilityCalendar &&
                  Object.keys(availabilityCalendar).map((day) => {
                    const dayInfo = availabilityCalendar[day]; // Access day information

                    // Check if dayInfo exists before accessing its properties
                    if (!dayInfo) return null; // Skip rendering if dayInfo is null or undefined

                    return (
                      <div
                        key={day}
                        className={`sub-wrapper ${
                          (bookingInfoStore.bookingStartDate &&
                          bookingInfoStore.bookingEndDate
                            ? isDateInRange(
                                dayInfo.date,
                                bookingInfoStore.bookingStartDate,
                                bookingInfoStore.bookingEndDate
                              )
                            : dayInfo.date === formatDate(startDate)) &&
                          "currentSelection"
                        }`}
                      >
                        <div className="sub-title">
                          {dayInfo.date.substring(0, 5)}
                        </div>
                        <div className="title">{day}</div>
                      </div>
                    );
                  })}
              </div>
              <div className="content__wrapper" ref={containerRef}>
                <div className="timeSlots">
                  <div className="timeSlots__wrapper">
                    {Object.keys(timeSlots).map((timeSlot, index) => (
                      <div key={index} className="time-slot">
                        {timeSlot.toString().padStart(2, "0") + ":00"}
                      </div>
                    ))}
                  </div>
                </div>
                {availabilityCalendar &&
                  Object.keys(availabilityCalendar).map((day) => {
                    const dayInfo = availabilityCalendar[day]; // Access day information

                    // Check if dayInfo exists before accessing its properties
                    if (!dayInfo) return null; // Skip rendering if dayInfo is null or undefined

                    // check if the date is less than the current date or not
                    const isExpiredDate =
                      parseDate(dayInfo.date, "/") <
                      new Date().setHours(0, 0, 0, 0) +
                        (parseInt(hallData.hallFreezDay) + 1) *
                          24 *
                          60 *
                          60 *
                          1000;

                    return (
                      <motion.div
                        key={day}
                        className="availableSlots__wrapper"
                        initial={{ opacity: 0 }} // Initial opacity
                        animate={{ opacity: 1 }} // Animation when component enters the DOM
                        exit={{ opacity: 0 }} // Animation when component exits the DOM
                        transition={{ duration: 0.5 }} // Animation duration
                        onClick={(e) =>
                          isExpiredDate
                            ? e.preventDefault()
                            : handleDateChange(dayInfo.date, day)
                        }
                      >
                        <div
                          className={`timeSlots__wrapper ${
                            (bookingInfoStore.bookingStartDate &&
                            bookingInfoStore.bookingEndDate
                              ? isDateInRange(
                                  dayInfo.date,
                                  bookingInfoStore.bookingStartDate,
                                  bookingInfoStore.bookingEndDate
                                )
                              : dayInfo.date === formatDate(startDate)) &&
                            "currentSelection"
                          }`}
                        >
                          {Object.entries(dayInfo.timeSlots).map(
                            ([timeSlot, isBooked]) => (
                              <Tooltip
                                key={timeSlot}
                                title={
                                  isExpiredDate
                                    ? "This slot is expired"
                                    : isBooked
                                    ? "This slot is already booked!"
                                    : "This slot is currently available!"
                                }
                                placement="top"
                                enterDelay={1500}
                                leaveDelay={0}
                              >
                                <div
                                  className={`time-slot ${
                                    isExpiredDate && "expiredTimeSlot"
                                  } ${
                                    bookingInfoStore.startTime &&
                                    bookingInfoStore.endTime &&
                                    isDateInRange(
                                      dayInfo.date,
                                      bookingInfoStore.bookingStartDate,
                                      bookingInfoStore.bookingEndDate
                                    ) &&
                                    isSelectedSlot(dayInfo.date, timeSlot) &&
                                    "selectedTimeSlot"
                                  }`}
                                  onClick={(e) =>
                                    isExpiredDate
                                      ? e.preventDefault()
                                      : handleTimeChange(timeSlot, isBooked)
                                  }
                                >
                                  {isBooked ? (
                                    <span className="unAvailableSlot">NA</span>
                                  ) : (
                                    <span className="availableSlot">Book</span>
                                  )}
                                  <span className="selectedSlot">
                                    <CheckCircleOutlineIcon className="icon" />
                                  </span>
                                  <span className="expiredSlot">
                                    {/* <DoNotDisturbIcon className="icon" /> */}
                                  </span>
                                </div>
                              </Tooltip>
                            )
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="unavailableMessageInfo__wrapper">
              <LockIcon className="icon" />
              <h2 className="title">This Content is Locked</h2>
              <p className="desc">Please subscribe to our site to unlock this content</p>
            </div>
          )}
        </>
      </div>
    </div>
  );
}

AvailabilityCalendar.propTypes = {
  hallData: PropTypes.object.isRequired,
};
