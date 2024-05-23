import { createServer } from 'http';
import express from 'express';
import session from 'express-session'; // Import express-session
import { Server as SocketServer } from 'socket.io';
import { default as dotenv } from 'dotenv';
import { default as multer } from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import Connection from './database/MongoDb.js';
import crypto from 'crypto';

// Import routes
import { 
    hallMasterRoute,
    countriesNowRoute,
    chatBotRoute,
    eventTypesRoute,
    bookingMasterRoute,
    customerMasterRoute,
    vendorTypesRoute,
    venueTypesRoute,
    hallBookingMasterRoute,
    geoLocationTrackerRoute,
    userAuthenticationRoute,
    serviceProviderMasterRoute,
    vendorMasterRoute,
    dashboardRoute
} from './routes/index.js';

const app = express();
const server = createServer(app);
const io = new SocketServer(server);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

export const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// Generate a random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Set a random secret key for the session
const secretKey = generateSecretKey();
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));

dotenv.config();
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const PORT = process.env.SERVER_PORT_NUMBER;
Connection(USERNAME, PASSWORD);



// Server Endpoints
app.use('/eventify_server/hallMaster/', hallMasterRoute);
app.use('/eventify_server/countriesNow/', countriesNowRoute);
app.use('/eventify_server/chatBot/', chatBotRoute);
app.use('/eventify_server/eventTypes/', eventTypesRoute);
app.use('/eventify_server/bookingMaster/', bookingMasterRoute);
app.use('/eventify_server/customerMaster/', customerMasterRoute);
app.use('/eventify_server/venueTypes/', venueTypesRoute);
app.use('/eventify_server/vendorTypes/', vendorTypesRoute);
app.use('/eventify_server/vendorMaster/', vendorMasterRoute);
app.use('/eventify_server/hallBookingMaster/', hallBookingMasterRoute);
app.use('/eventify_server/geoLocationTracker/', geoLocationTrackerRoute);
app.use('/eventify_server/userAuthentication/', userAuthenticationRoute);
app.use('/eventify_server/serviceProviderMaster/', serviceProviderMasterRoute);
app.use('/eventify_server/dashboard/', dashboardRoute);
app.use(upload.any());

// Server Endpoint to provide real-time updates


server.listen(PORT, () => console.log(`Server running successfully on port ${PORT}`));
