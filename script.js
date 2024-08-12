import { onAuthStateChanged,auth,signInWithEmailAndPassword,db,collection,getDocs,createUserWithEmailAndPassword } from "./js/firebase.js";


const login=()=>{
    const email=document.querySelector('#input_email');
const password=document.querySelector('#input_password');

signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    // Signed in 
    
    const user = userCredential.user;
    if(user.email==="admin@gmail.com"){
        location.href="dashboard.html";
    }
    else{
      window.location.href="index.html";
    }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);
  });


}
const login_btn=document.querySelector('#login_btn');

login_btn&&login_btn.addEventListener('click',login);




const getAllRestaurants=async()=>{
  const pageSpinner=document.getElementById("page-spinner");
  pageSpinner.style.display="block"
  const q=collection(db,"restaurants");
  const resList=document.getElementById("res-list");
  resList.innerHTML="";
  let a=0;
  const querySnapshot=await getDocs(q);
  pageSpinner.style.display="none";
  querySnapshot.forEach(doc => {
      console.log(doc.data());
      
      resList.innerHTML+=`
      <div class="col">
                <div class="card " style="width: 18rem;">
                    <img class="card-img-top" src="${doc.data().image}" alt="Card image cap" >
                    <div class="card-body">
                        <h5 class="card-title">${doc.data().name}</h5>
                        <p class="card-text">All Taste in one</p>
                        <p>
                            <span class="badge bg-primary">Zinger Burger</span>
                            <span class="badge bg-primary">Beef Burger</span>
                            <span class="badge bg-primary">Anda Wala Burger</span>
                        </p>
                        <a href="dishes.html?restaurant=${doc.id}" class="btn btn-primary">View All Dishes</a>
                    </div>
                </div>
            </div>
      
      `
     
      
  });
}




onAuthStateChanged(auth,(user)=>{
  //
   if(user){
    console.log(user.email);
    getAllRestaurants();
  }
  else{
    
    window.location.href="login.html"
  }
})

const submit_btn=document.getElementById("submit_btn");
submit_btn&&submit_btn.addEventListener("click",async(e)=>{
  const email=document.getElementById("email");
  const password=document.getElementById("password");
e.preventDefault();
 
  createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
     
    const user = userCredential.user;
    alert("Successfully Created");
    setTimeout(() => {
      window.location.href="login.html";
    }, 2000);
  })
  .catch((error) => {
    console.log("error in creating account")
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
  
})





