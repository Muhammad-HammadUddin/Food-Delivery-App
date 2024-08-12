
import {auth,onAuthStateChanged,signOut}from "./firebase.js";


onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(user.email);
      if(user.email!=="admin@gmail.com"){
        window.location.href="login.html";
      }
      
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
  const logout=function(){
    localStorage.removeItem('cart');
    signOut(auth).then(() => {
        window.location.href = "index.html";
       
      }).catch((error) => {
        
        console.log(error);
      });
}
const Logout_btn=document.getElementById("Logout_btn")
Logout_btn.addEventListener("click",logout)