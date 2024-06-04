import { default as express } from 'express';
const router = express.Router();
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import {doc, getDoc, updateDoc} from 'firebase/firestore';

import { bookingMaster } from '../models/index.js';
import {firestore} from "../database/FirebaseDb.js";

router.get("/", async (req, res) => {
    try {
        // Add logic here to fetch data from the database
        const data = await bookingMaster.find(); // Example: fetching all bookingMaster documents

        // Send the fetched data in the response
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

// get the total hall owner count
router.get("/getBookingCount", async(req, res) => {

    const filter = {};

    try {
        const bookingCount = await bookingMaster.countDocuments(filter);

        if(typeof bookingCount !== "number") {
            return res.status(501).json({message: "Connection to server failed."});
        }

        return res.status(200).json(bookingCount);
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
});

router.get("/:id", async (req, res) => {
    const bookingId = req.params.id;

    try {
        const bookingdata = await bookingMaster.findById(bookingId);

        if (!bookingdata) {
            return res.status(404).json({ message: "Customer not found" });
        }

        return res.status(200).json(bookingdata);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    
    try {
        const { id } = req.params;
        const{bookingStatus,remarks}=req.body;
        // Update the bookingStatus to 'confirmed' or 'REJECTED' in the bookingMaster table
        const updatedBooking = await bookingMaster.findByIdAndUpdate(
          id,
          { bookingStatus, remarks },
          { new: true }
        );
    
        res.status(200).json(updatedBooking);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
  });

  // route only created for hall bookings
  router.post("/", async (req, res) => { 
    const postData = req.body;
    console.log(postData);
    if(!postData) {
        return res.status(404).json({message: "Request Body attachment not found!!"});
    }

    const hallObjectId = new mongoose.Types.ObjectId(postData.hallId);
    const vendorTypeObjectId = new mongoose.Types.ObjectId(postData.vendorTypeId);
    const eventTypeObjectId = new mongoose.Types.ObjectId(postData.eventId);
    const customerObjectId = new mongoose.Types.ObjectId(postData.customerId);
    const hallUserObjectId = new mongoose.Types.ObjectId(postData.hallUserId);

    // to get the updated booking id from firebase
    const docRef = doc(firestore, "counters", "bookingMasterId");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return res.status(404).send("Document not found!");
    }

    const data = docSnap.data();
    const prevId = data.currentId;
    const newId = prevId + 1;
    
    console.log("New Booking Id: " + newId);

    const updatedData = {
        documentId: parseInt(newId),
        ...postData,
        hallId: hallObjectId,
        vendorTypeId: vendorTypeObjectId,
        eventId: eventTypeObjectId,
        customerId: customerObjectId,
        hallUserId: hallUserObjectId
    };

    const newDocument = new bookingMaster(updatedData);
    console.log("ENTERED 1")
    console.log(hallUserObjectId);

    if(!newDocument) {
        return res.status(404).json({message: "Operation Failed!!"});
    }
    console.log("ENTERED 2")
    
    try {
        const savedDocument = await newDocument.save();
        
        console.log("ENTERED 2")
        // Update the Firestore document with the new ID
        await updateDoc(docRef, {currentId: newId});

        return res.status(200).json(savedDocument);
    } catch(error) {
        console.error(error);
        return res.status(500).json(error);
    }
});
export default router;