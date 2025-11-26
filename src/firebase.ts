// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTBsOSAR8B-Egce8WWLw_IFQSpKHY6Kjg",
  authDomain: "bank-system-2a3f1.firebaseapp.com",
  projectId: "bank-system-2a3f1",
  storageBucket: "bank-system-2a3f1.firebasestorage.app",
  messagingSenderId: "1096182651792",
  appId: "1:1096182651792:web:a62e0c3a22b43d4ab67115",
  measurementId: "G-R1EEKKJ4KL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

// ---------- LOGIN FLOW ----------

// Google Login → Check whitelist → Create user record
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const email = user.email || "";
    const uid = user.uid;

    // 1. Check whitelist
    const whitelistRef = doc(db, "whitelist", email);
    const whitelistSnap = await getDoc(whitelistRef);

    if (!whitelistSnap.exists()) {
      // Not allowed → log out
      await signOut(auth);
      throw new Error("你的帳號不在白名單中，請聯繫管理員。");
    }

    const role = whitelistSnap.data().role || "TELLER";

    // 2. Create / Update user document
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      email,
      role,
      uid,
      lastLogin: new Date().toISOString()
    });

    return { email, role };
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export function logout() {
  return signOut(auth);
}
