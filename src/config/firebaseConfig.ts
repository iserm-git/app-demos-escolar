import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD7zPNRvqE_0YMtn3ERGrmoBIPV59M-Hxw",
  authDomain: "sistema-escolar-19372.firebaseapp.com",
  projectId: "sistema-escolar-19372",
  storageBucket: "sistema-escolar-19372.firebasestorage.app",
  messagingSenderId: "223912116666",
  appId: "1:223912116666:web:3e299655229cc752511d83",
};

let app;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);

console.log("✅ Firebase inicializado correctamente");

export { auth, db };
export default app;
