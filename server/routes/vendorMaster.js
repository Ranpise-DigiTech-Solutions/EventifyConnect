import { default as express } from 'express';
const router = express.Router();
import { firebaseStorage } from '../database/FirebaseDb.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { vendorMaster } from '../models/index.js';

router.get("/", async (req, res) => {
    try {
        // Add logic here to fetch data from the database
        const data = await vendorMaster.find(); // Example: fetching all vendorMaster documents

        // Send the fetched data in the response
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

router.post('/', async (req, res) => {
    const newDocument = new vendorMaster(req.body);

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

router.post('/registerVendor', async (req, res) => {
    
    if(!req.body || !req.query.userId || !req.query.vendorType) {
        return res.status(404).json({message: "Required Fields missing in the Request body!!"});
    }
    
    const { vendorRegisterDocument, vendorImages, ...vendorData } = req.body;
    const { userId, vendorType } = req.query;
    let vendorRegisterDocumentUrl = "";
    const vendorImagesUrl = [];
    const vendorRegisterDocumentRef = ref(firebaseStorage, `VENDOR/${vendorType}/${userId}/RegistrationDocument`)
    const vendorImagesRef = ref(firebaseStorage, `VENDOR/${vendorType}/${userId}/VendorImages`);

    try {
        if(vendorRegisterDocument) {
            await uploadBytes(vendorRegisterDocumentRef ,vendorRegisterDocument);
            vendorRegisterDocumentUrl = await getDownloadURL(vendorRegisterDocumentRef);
        }

        if(vendorImages || vendorImages.length !== 0) {
            for (const vendorImage of vendorImages) {
                await uploadBytes(vendorImagesRef ,vendorImage);
                const getVendorImageURL = await getDownloadURL(vendorImagesRef);
                vendorImagesUrl.push(getVendorImageURL);
            }
        }

        const postBody = {
            ...vendorData,
            vendorRegisterDocument: vendorRegisterDocumentUrl,
            vendorImages: vendorImagesUrl
        }

        const newDocument = new vendorMaster(postBody);
    
        if(!newDocument) {
            return res.status(409).json({message: "Request couldn't be processed due to conflict in current resource!"})
        }

        const savedDocument = await newDocument.save();
        return res.status(200).json(savedDocument);
    } catch(err) {
        console.log(err.message)
        return res.status(500).json(err.message);
    }
});

export default router;