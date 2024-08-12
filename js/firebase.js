
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
  import { signOut,onAuthStateChanged,getAuth,signInWithEmailAndPassword,createUserWithEmailAndPassword} from  "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
  import { getStorage,ref,uploadBytesResumable,getDownloadURL} from  "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";
  import { getFirestore,collection,addDoc, query,updateDoc,
    where,
    getDocs,getDoc,doc,serverTimestamp} from   "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCWwzU6sjd3BI_Yy7mHh_DmXJF5NfuKSL0",
    authDomain: "new-proj-da652.firebaseapp.com",
    projectId: "new-proj-da652",
    storageBucket: "new-proj-da652.appspot.com",
    messagingSenderId: "226359032013",
    appId: "1:226359032013:web:3008ce4698952a4d349184",
    measurementId: "G-FP1RR60636"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const storage=getStorage(app);
  const db=getFirestore(app);
  export{
    auth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,db,collection,addDoc,
    query,
    where,
    getDocs,
    getDoc,doc,
    serverTimestamp,
    updateDoc,
    signOut,
    createUserWithEmailAndPassword
    
  }
