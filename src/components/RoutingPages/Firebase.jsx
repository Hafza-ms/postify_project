// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // ✅ Add this line

const Firebase = {
  apiKey: "AIzaSyAd6QWX-3NYKMRVSD0xJDG7eDIVE_N1XcY",
  authDomain: "postify-app-og.firebaseapp.com",
  projectId: "postify-app-og",
  storageBucket: "postify-app-og.appspot.com",
  messagingSenderId: "778508213501",
  appId: "1:778508213501:web:e56cece76848d14884f294",
  measurementId: "G-HEDYJC3MVG"
};

const app = initializeApp(Firebase);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // ✅ Add this line

export { db, storage, auth }; // ✅ Export auth too
