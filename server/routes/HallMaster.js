import { default as express } from 'express';
const router = express.Router();
import { ObjectId } from 'mongodb';
import { firebaseStorage } from '../database/FirebaseDb.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { hallMaster } from '../models/index.js';

router.get("/getHallDetails", async (req, res) => {

    const { hallId } = req.query;
    const filter = {};

    if (hallId) {
        filter["_id"] = hallId;
    }

    try {
        const hallDetails = await hallMaster.find(filter);

        if(!hallDetails) {
            return res.status(404).json({message: "No Records Found"});
        }

        return res.status(200).json(hallDetails);
    } catch (error) {
        return res.status(500).json({message: "Error" + error.message});
    }
});


router.get('/', async(req, res)=> {

    const { hallCity, eventId } = req.query;
    let specificObjectId = ""; // Event Type Object ID in Str

    function isObjectIdFormat(str) {
        return /^[0-9a-fA-F]{24}$/.test(str);
      }
    
    if (eventId && isObjectIdFormat(eventId)) {
        specificObjectId = new ObjectId(eventId);
        if (!ObjectId.isValid(specificObjectId)) {
            specificObjectId = null;
        }
    } else {
        specificObjectId = null;    
    }

    try {
        const hallDetails = await hallMaster.aggregate([
            {
                $match: {
                    "hallCity": hallCity ? hallCity : {$exists: true},
                    "hallEventTypes" : specificObjectId ? { $in: [specificObjectId] } : { $exists: true }
                }
            }
        ]);
        return res.status(200).json(hallDetails); 
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
});

router.post('/', async (req, res) => {
    const newDocument = new hallMaster(req.body);

    if(!newDocument) {
        return res.status(404).json({message: "Request Body attachment not found!!"});
    }

    try {
        const savedDocument = await newDocument.save();
        return res.status(200).json(savedDocument);
    } catch(err) {
        return res.status(500).json(err);
    }
});

router.post('/registerHall', async (req, res) => {

    if(!req.body || !req.query.userId) {
        return res.status(404).json({message: "Required Fields missing in the Request body!!"});
    }

    const { hallRegisterDocument, hallImages, hallParking, ...hallData } = req.body;
    const userId = req.query.userId;
    let hallRegisterDocumentUrl = "";
    const hallImagesUrl = [];
    const hallRegisterDocumentRef = ref(firebaseStorage, `VENDOR/BanquetHall/${userId}/RegistrationDocument`);
    const hallImagesRef = ref(firebaseStorage, `VENDOR/BanquetHall/${userId}/HallImages/image.jpg`);

    try {
        if(hallRegisterDocument) {
            await uploadBytes(hallRegisterDocumentRef ,hallRegisterDocument);
            hallRegisterDocumentUrl = await getDownloadURL(hallRegisterDocumentRef);
        }

        console.log("ENTERED0")
        console.log("ENTERED0")

        if(hallImages || hallImages.length !== 0) {
            for (const hallImage of hallImages) {
                await uploadBytes(hallImagesRef ,hallImage);
                const getHallImageURL = await getDownloadURL(hallImagesRef);
                hallImagesUrl.push(getHallImageURL);
            }
        }

        const postBody = {
            ...hallData,
            hallParking: hallParking === "AVAILABLE", 
            hallRegisterDocument: hallRegisterDocumentUrl,
            hallImages: hallImagesUrl
        }

        const newDocument = new hallMaster(postBody);
    
        if(!newDocument) {
            return res.status(409).json({message: "Request couldn't be processed due to conflict in current resource!"})
        }
        console.log(newDocument);

        const savedDocument = await newDocument.save();
        return res.status(200).json(savedDocument);
    } catch(err) {
        console.log(err.message);
        return res.status(500).json(err);
    }
});


router.patch('/:id', async (req, res) => {

    const resourceId = req.params.id;
    const updatedFields = req.body;

    if(!resourceId || !updatedFields) {
        return res.status(404).json({message: "Required fields missing!!"});
    }

    try {
        const updatedResource = await hallMaster.findOneAndUpdate(
            { _id: resourceId },
            { $set: updatedFields },
            { new: true }
          );
      
          if (!updatedResource) {
            return res.status(404).json({ message: 'Resource not found' });
          }
      
          res.status(200).json(updatedResource);
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
});

router.delete("/:id", async (req, res) => {

    const { id } = req.params;

    if(!id) {
        return res.status(404).json({message: "Missing Id parameter!!"});
    }

    try {
      const deletedHall = await hallMaster.findByIdAndDelete(id);
  
      if (!deletedHall) {
        return res.status(404).json({ message: 'Document not found.' });
      }
  
      return res.status(200).json({ message: 'Document deleted successfully.', deletedHall });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
});

export default router;