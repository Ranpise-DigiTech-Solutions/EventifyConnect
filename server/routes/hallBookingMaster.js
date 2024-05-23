import { default as express } from "express";
const router = express.Router();
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

import { hallMaster, hallBookingMaster } from "../models/index.js";

router.get("/", async (req, res) => {
  try {
      // Add logic here to fetch data from the database
      const data = await hallBookingMaster.find(); // Example: fetching all bookingMaster documents

      // Send the fetched data in the response
      return res.status(200).json(data);
  } catch (error) {
      return res.status(500).json({message: error.message});
  }
});

router.get("/getHallsAvailabilityStatus", async (req, res) => {
  const { selectedDate, selectedCity, eventId } = req.query;

  let eventObjectId = ""; // Event Type Object ID in Str

  function isObjectIdFormat(str) {
    return /^[0-9a-fA-F]{24}$/.test(str);
  }

  if (eventId && isObjectIdFormat(eventId)) {
    eventObjectId = new ObjectId(eventId);
    if (!ObjectId.isValid(eventObjectId)) {
      eventObjectId = null;
    }
  } else {
    eventObjectId = null;
  }

  try {
    // Get all halls
    const allHalls = await hallMaster.aggregate([
      {
        $match: {
          hallCity: selectedCity ? selectedCity : { $exists: true },
          hallEventTypes: eventObjectId
            ? { $in: [eventObjectId] }
            : { $exists: true },
        },
      },
    ]);

    // Find bookings for the given date
    const startDate = new Date(selectedDate + "T00:00:00.000Z");
    const endDate = new Date(selectedDate + "T23:59:59.999Z");

    const bookings = await hallBookingMaster.aggregate([
      {
        $match: {
          $or: [
            {
              $and: [
                { bookingStartDateTimestamp: { $lte: endDate } },
                { bookingEndDateTimestamp: { $gte: startDate } },
              ],
            },
            {
              $and: [
                { bookingStartDateTimestamp: { $lte: endDate } },
                { bookingEndDateTimestamp: null }, // Handling bookings that extend beyond the selected date
              ],
            },
          ],
          hallCity: selectedCity ? selectedCity : { $exists: true },
          eventId: eventObjectId ? eventObjectId : { $exists: true },
        },
      },
      {
        $project: {
          hallId: 1,
          hallCity: 1,
          totalDuration: {
            $cond: [
              // 1. check if booking spans the entire day
              {
                $and: [
                  { $lte: ["$bookingStartDateTimestamp", startDate] },
                  { $gte: ["$bookingEndDateTimestamp", endDate] },
                ],
              },
              "$bookingDuration", // Use full duration if booking spans the entire selected date
              {
                $cond: [
                  // 2. check if booking starts on or after the selected date
                  { $gte: ["$bookingStartDateTimestamp", startDate] },
                  // if it does, calculate the duration from the start of selected date to the end of booking date
                  { $subtract: [endDate, "$bookingStartDateTimestamp"] },
                  // if it doesn't, calculate the duration from booking start date to the end of the selected date
                  { $subtract: ["$bookingEndDateTimestamp", startDate] },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            hallId: "$hallId",
            hallCity: "$hallCity",
          },
          totalDuration: { $sum: "$totalDuration" },
        },
      },
      {
        $project: {
          _id: 0,
          hallId: "$_id.hallId",
          hallCity: "$_id.hallCity",
          totalDuration: 1,
        },
      },
    ]);

    // Group bookings by hall
    const bookingsByHall = {};
    bookings.forEach((booking) => {
      bookingsByHall[booking.hallId] = booking;
    });

    // Calculate availability status for each hall
    const hallAvailability = allHalls.map((hall) => {
      const isHallAvailable = !bookingsByHall[hall._id]; //check if the hall is booked atleast once
      const checkAvailability = () => {
        const hallBookingDetails = bookingsByHall[hall._id];
        return hallBookingDetails.totalDuration > 8
          ? "UNAVAILABLE"
          : "LIMITED AVAILABILITY";
      };
      const availabilityStatus = isHallAvailable
        ? "AVAILABLE"
        : checkAvailability();
      return {
        hallId: hall._id,
        hallName: hall.hallName,
        availability: availabilityStatus,
        hallCity: hall.hallCity,
        hallImages: hall.hallImages,
        hallDescription: hall.hallDescription,
      };
    });

    return res.status(200).json(hallAvailability);
  } catch (error) {
    console.error("Error calculating available time slots:", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/getHallAvailability", async (req, res) => {
  const { hallId, startDate, endDate } = req.query;
  const hallObjectId = new mongoose.Types.ObjectId(hallId);
  
  const startDateOfWeek = new Date(startDate);
  const endDateOfWeek = new Date(endDate);

  try {
    const hallBookings = await hallBookingMaster.aggregate([
      {
        $match: {
          hallId: hallObjectId,
          $or: [
            {
              $and: [
                { bookingStartDateTimestamp: { $lte: endDateOfWeek } },
                { bookingEndDateTimestamp: { $gte: startDateOfWeek } }
              ]
            },
            {
              $and: [
                { bookingStartDateTimestamp: { $lte: endDateOfWeek } },
                { bookingEndDateTimestamp: null } // Handling bookings that extend beyond the selected date
              ]
            }
          ],
        },
      },
      {
        $project: {
          _id: 1,
          hallId: 1,
          bookingStartDateTimestamp: 1,
          bookingEndDateTimestamp: 1,
          bookingDuration: 1,
        },
      },
    ]);

    if (!hallBookings) {
      return res.status(200).json({ message: "No data found!!" });
    }

    return res.status(200).json(hallBookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/getHallBookings", async (req, res) => {

  const { hallId, bookingStartDateTimestamp, bookingEndDateTimestamp } = req.query;  //date format - mongodb format
  const hallObjectId = new mongoose.Types.ObjectId(hallId);
  const startDate = new Date(bookingStartDateTimestamp);
  const endDate = new Date(bookingEndDateTimestamp);
  console.log(startDate);
  console.log(endDate);
  console.log(bookingStartDateTimestamp);
  console.log(bookingEndDateTimestamp);
  try {
    const hallBookings = await hallBookingMaster.aggregate([
      {
        $match: {
          hallId: hallObjectId,
          $or: [
            {
              $and: [
                { bookingStartDateTimestamp: { $lte: endDate } },
                { bookingEndDateTimestamp: { $gte: startDate } }
              ]
            },
            {
              $and: [
                { bookingStartDateTimestamp: { $lte: endDate } },
                { bookingEndDateTimestamp: null } // Handling bookings that extend beyond the selected date
              ]
            }
          ],
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          count: { $ifNull: ["$count", 0] }
        }
      }
    ]);
    console.log(hallBookings);
    if(hallBookings.length === 0) {
      return res.status(200).json({ count: 0 });
    }

    return res.status(200).json(hallBookings[0]);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
 
  const newDocument = new hallBookingMaster(req.body);
     
  if (!newDocument) {
    return res
      .status(404)
      .json({ message: "Request Body attachment not found!!" });
  }

  try {
    const savedDocument = await newDocument.save();
    return res.status(200).json(savedDocument);
  } catch (err) {
    console.error("An error occurred:", err);
    return res.status(500).json(err);
  }
});

export default router;
