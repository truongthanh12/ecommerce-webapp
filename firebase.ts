import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FacebookAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCK6pMk5XuNhpdkuTiUSQkvcD_NEWc0VXg",
  authDomain: "ecommer-nextjs.firebaseapp.com",
  databaseURL: "https://ecommer-nextjs-default-rtdb.firebaseio.com",
  projectId: "ecommer-nextjs",
  storageBucket: "ecommer-nextjs.appspot.com",
  messagingSenderId: "1081379901139",
  appId: "1:1081379901139:web:29ea7c406e1c77bb89ce26",
  measurementId: "G-FP7GHEDSP0",
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const db = getFirestore(app);
const auth = getAuth(app);
const providers = {
  facebook: new FacebookAuthProvider(),
  google: new GoogleAuthProvider(),
};

export const storage: any = getStorage(app);
const storageRef: any = (path: string) => ref(storage, path);

export { auth, providers, storageRef };
export default db;
