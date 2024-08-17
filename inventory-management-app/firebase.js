// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBTQY_XfoUKFTmoB_XLHe10NsHc5dxFtNA",
  authDomain: "inventory-management-app-f3e6a.firebaseapp.com",
  projectId: "inventory-management-app-f3e6a",
  storageBucket: "inventory-management-app-f3e6a.appspot.com",
  messagingSenderId: "1078703618311",
  appId: "1:1078703618311:web:b826cf3c09d2e5ea3f2da2",
  measurementId: "G-VNDF3V8LCT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const firestore = getFirestore(app);
export { firestore };
