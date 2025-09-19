import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from './firebaseConfig';

// Hold the initialized services
let app;
let auth;
let db;

const initializeFirebase = () => {
    if (app) return; // Already initialized

    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        console.log("Firebase initialized successfully");
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        // Propagate the error to stop the app from loading
        throw error;
    }
};

// Export the services. They will be undefined until initializeFirebase is called and completes.
// The application's entry point (`main.jsx`) will handle this.
export { initializeFirebase, app, auth, db };
