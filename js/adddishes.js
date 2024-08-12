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
    
  } from "./firebase.js";
  

  const getAllRestaurants=async()=>{
    try {
      const q=collection(db,"restaurants");
      const resSelect=document.getElementById("restaurant-name");
      const querySnapshot=await getDocs(q);
      let resturants=[];
    resSelect.innerHTML=`<option selected>Select Restaurant</option>`
      querySnapshot.forEach(doc => {
        resturants.push({...doc.data(),id:doc.id});
          resSelect.innerHTML+=`<option value="${doc.id}">${doc.data().name}</option>`
          
          
      });
      return new Promise((resolve,reject)=>{
        resolve(resturants);
      })
    } catch (error) {
      console.log("error",error);
    }
   
   
    
  
}

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



  getAllRestaurants();
  
  const addDish=document.getElementById("addDish");
  addDish.addEventListener("click",async()=>{
    const spinner=document.getElementById("dish-spinner");
    const closebtn=document.getElementById("close-btn")
    const restaurantName=document.getElementById("restaurant-name");
    const dishName=document.getElementById("dish-name");
    const dishprice=document.getElementById("dish-price");
    const dishServing=document.getElementById("dish-serving");
    const dishimage=document.getElementById("dish-image");
    const image=await uploadFile(dishimage.files[0],dishName.value);
    spinner.style.display="block";
    const dishDetail={
        restaurant:restaurantName.value,
        name:dishName.value,
        price:dishprice.value,
        serving:dishServing.value,
        image

    }
    const docRef = await addDoc(collection(db, "dishes"), {
        dishDetail
      });
      restaurantName.value="";
      dishName.value="";
      dishprice.value="";
      dishServing.value="";
      dishimage.value="";
      spinner.style.display="none";
      closebtn.click();

    console.log(docRef);
getallDishes();
  })

  const getallDishes = async () => {
    const restaurants=await getAllRestaurants();
    console.log("hye");
    const q = collection(db, "dishes");
    const alldishes = document.getElementById("all-dishes");
    alldishes.innerHTML = "";
    let a = 0;

    let restaurantNames={};
    for(let i=0;i<restaurants.length;i++){
      restaurantNames[restaurants[i].id]=restaurants[i].name;

    }
    console.log("restaurant Names",restaurantNames);
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(doc => {
        const dish = doc.data().dishDetail;
        // Access the dishDetail object here
        a++;
        // const restaurantName=restaurants.filter(v=> v.id===dish.restaurant);

        
        alldishes.innerHTML += ` 
            <tr>
                <th scope="row">${a}</th>
                <td><img class="dish-image" src="${dish.image}" alt=""></td>
                <td>${dish.name}</td>
                <td>${dish.price}</td>
                <td>${dish.serving}</td>
                <td>${restaurantNames[dish.restaurant]}</td>
            </tr>
        `;
    });
} 


 getallDishes();

