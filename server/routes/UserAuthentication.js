import { default as express } from 'express';
const router = express.Router();
import { getDatabase, ref, set, get } from 'firebase/database';
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, 
    sendSignInLinkToEmail 
} from 'firebase/auth';
// Developer Note:- Please refrain from using fetchSignInMethodsForEmail... since it always returns null as "Enumeration" is enabled by default in the firebase project
  
import { firebaseAuth, firebaseDb } from '../database/FirebaseDb.js';
import { v4 as uuidv4 } from 'uuid';
import { serviceProviderMaster, customerMaster, vendorMaster } from '../models/index.js';

import axios from 'axios';

import {
    getAuth,
    signInWithRedirect,
    getRedirectResult,
    GoogleAuthProvider
} from "firebase/auth";
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

router.post("/passwordlessSignIn/", async (req, res) => {

    const { inputValue, inputType, userType } = req.query;

    // var cipherText = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_ENCRYPTION_SECRET_KEY).toString();
    console.log("ENTERED")

    try {

        if (inputType === "EMAIL") {
            // Implementing Firebase Email password-less sign in
            const actionCodeSettings = {
                url: 'http://localhost:5173/DescriptionPage',
                handleCodeInApp: true,
                // iOS: {
                //   bundleId: 'com.example.ios'
                // },
                // android: {
                //   packageName: 'com.example.android',
                //   installApp: true,
                //   minimumVersion: '12'
                // },
                // dynamicLinkDomain: 'example.page.link'
            };

            sendSignInLinkToEmail(firebaseAuth, "adikrishna1972@gmail.com", actionCodeSettings)
                .then(() => {
                    // window.localStorage.setItem('emailForSignIn', email);
                    return res.status(200).json({ message: "Successfully Sent Sign-In mail" });
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    return res.status(errorCode).json({ message: errorMessage });
                });



        } else if (inputType === "PHONE") {

        }

        // const existingUsers = await fetchSignInMethodsForEmail(auth, req.body.email);

        // if (existingUsers.length > 0) {
        //   console.log('User already exists with this email. Operation canceled!!');
        //   return response.status(401).json({message: 'User already exists!!'});
        // }

        // const userCredential = await createUserWithEmailAndPassword(auth, req.body?.email, req.body?.password);
        // const user =  userCredential.user;

        // const userRef = ref(db, 'Users/' + user.uid);
        // set(userRef, {
        //     email : req.body.email,
        //     password : cipherText,
        //     userType: req.body.userType,
        //     uid: uuidv4()
        // });

        // console.log("User Created Successfully!!", user.uid);
        // return res.status(200).json({message: user.uid});
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

});

router.post("/loginWithPassword", async (req, res) => {

    const { userEmail, userPassword, userType } = req.body;
    console.log("Login attempt:", userEmail, userPassword, userType); 
    try {
        const user = userType === "CUSTOMER" ? await customerMaster.findOne({"customerEmail": userEmail}) : await serviceProviderMaster.findOne({"vendorEmail": userEmail});

        if(!user){
            return res.status(401).json({message: "No User records found!! Please check your email to continue or Sign Up."});
        }

        const originalPassword = CryptoJS.AES.decrypt(userType === "CUSTOMER" ? user.customerPassword : user.vendorPassword, process.env.PASSWORD_ENCRYPTION_SECRET_KEY).toString(CryptoJS.enc.Utf8);

        if(originalPassword !== userPassword) {
            return res.status(401).json({message: "Wrong password"});
        }

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d"}
        );

        const { customerPassword, vendorPassword, ...info } = user._doc;

        res.status(200).json({ ...info, accessToken});
    } catch(error) {
        return res.status(500).json({message: error.message});
    }
});

router.post("/registerUser", async (req, res) => {

    const { userType, data, user } = req.body; // user = FirebaseUser

    var cipherText = CryptoJS.AES.encrypt(data.password, process.env.PASSWORD_ENCRYPTION_SECRET_KEY).toString();

    try {
        // const existingUsers = await fetchSignInMethodsForEmail(firebaseAuth, data.email);

        const existingCustomers = await customerMaster.find({
            $or: [
              { "customerEmail": data.email },
              { "customerContact": data.phone }
            ]
          });
        const existingVendors = await serviceProviderMaster.find({
            $or: [
              { "vendorEmail": data.email },
              { "vendorContact": data.phone }
            ]
          });

        if (existingCustomers.length > 0 || existingVendors.length > 0) {
            console.log('User already exists with this email. Operation canceled!!');
            return res.status(401).json({ message: 'User already exists!!' });
        }

        // Create a new entry in mongodb
        const response = userType === "CUSTOMER" ? await axios.post("http://localhost:8000/eventify_server/customerMaster/", {
            customerUid: user.uid,
            customerName: data.fullName,
            customerEmail: data.email,
            customerPassword: cipherText,
            customerContact: data.phone,
            customerCurrentLocation: data.location,
            programId: "USER"
        }) : await axios.post("http://localhost:8000/eventify_server/serviceProviderMaster/", {
            vendorUid: user.uid,
            vendorName: data.fullName,
            vendorTypeId: data.vendorTypeInfo,
            vendorCurrentLocation: data.location,
            vendorContact: data.phone,
            vendorEmail: data.email,
            vendorPassword: cipherText,
            vendorCompanyName: data.brandName,
            vendorLocation: data.cityName,
            eventTypes: data.eventTypesInfo,
            programId: "USER"
        });

        const userRef = ref(firebaseDb, 'Users/' + user.uid);
        await set(userRef, {  // Creating a new entry in firebase
            userType: userType,
            name: data.fullName,
            email: data.email,
            contact: data.phone,
            _id: response.data._id,
        });

        console.log("User Created Successfully!!", user.uid);
        return res.status(200).json({
            "UID": user.uid,
            "Document": response.data,
        });
    } catch (error) {
        console.log("ERROR", error);
        return res.status(500).json(error.message);
    }
});

router.get("/getUserData/:id", async (req, res) => {

    const currentUserId = req.params.id;

    console.log(currentUserId)

    if(!currentUserId) {
        return res.status(404).json({message: "Data not found!"});
    }

    try {
        const userRef = ref(firebaseDb, 'Users/' + currentUserId);
        const snapshot = await get(userRef);
        if(snapshot.exists()) {
            const userData = snapshot.val(); // firebase data
            console.log(snapshot.val());

            let userRecord; // Mongo record
            const userType = userData.userType;
            let vendorType;

            if(userType === "CUSTOMER") {
                userRecord = await customerMaster.findById(userData._id);
            } else if(userType === "VENDOR") {
                userRecord = await serviceProviderMaster.findById(userData._id);
                vendorType = await vendorMaster.findById(userRecord.vendorTypeId);
            }

            console.log(userRecord);
            return res.status(200).json({
                UID: currentUserId,
                Document: userRecord,
                userType: userType,
                vendorType: vendorType
            })
        } else {
            return res.status(404).json({message: "User not found!"});
        }
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

export default router;