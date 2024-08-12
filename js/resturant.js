import {
    auth,
    onAuthStateChanged,
    storage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    addDoc,
    db,
    collection,
    query,
    where,
    getDocs,
    signOut
  } from "./firebase.js";
  
  console.log("bye");
  
  const logo = document.getElementById("restaurant-logo");
  const selected_logo = document.getElementById("selected-logo");
  let file;

  logo && logo.addEventListener("change", (e) => {
    file = e.target.files[0];
    console.log(file);
  
    selected_logo.style.display = "flex";
    selected_logo.src = URL.createObjectURL(e.target.files[0]);
  });

  const getAllRestaurants=async()=>{
    const q=collection(db,"restaurants");
    const resList=document.getElementById("res-list");
    resList.innerHTML="";
    let a=0;
    const querySnapshot=await getDocs(q);
    querySnapshot.forEach(doc => {
        console.log(doc.data());
        a++;
        resList.innerHTML+=`
        <tr>
           <th scope="row">${a}</th>
            <td><img class="res-logo-image" src="${doc.data().image}"></td>
            <td>${doc.data().name}</td>
            <td>${doc.data().address}</td>

        </tr>`
        
    });
  }

  getAllRestaurants();
  
  const submitrestaurant = document.getElementById('submit-restaurant');
  
  submitrestaurant &&submitrestaurant.addEventListener('click', async () => {
    try {
        const closeBtn=document.getElementById("close-btn");
      const spinner = document.getElementById("restaurant-spinner");
      spinner.style.display = "block";
      const name = document.getElementById("restaurant-name");
      const address = document.getElementById("restaurant-address");
      const image = await uploadFile(file, name.value);
      const docRef = await addDoc(collection(db, "restaurants"), {
        name: name.value,
        address: address.value,
        image
      });
      spinner.style.display = "none";
      name.value="";
      address.value="";
      logo.value="";
      selected_logo.style.display = "none";
      console.log("Document written with ID:", docRef.id);
      closeBtn.click();
      getAllRestaurants();
    } catch (error) {
      console.error("Error adding document:", error);
      closeBtn.click();
    }
  });
  
  const uploadFile = (file, name) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${name.split(" ").join("-")}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };
  export{uploadFile};

  
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