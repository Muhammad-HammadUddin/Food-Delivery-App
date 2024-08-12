import { signOut,collection, getDocs, db,doc, where, query,getDoc } from "./firebase.js";
var urlParams = new URLSearchParams(window.location.search);
let mainContent=document.getElementById("main-content");
let pageSpinner=document.getElementById("page-spinner");
console.log("hye")
let aDishes=[];
const getallDishes = async () => {
    try {
        
        const restaurantParam = urlParams.get('restaurant');

        if (!restaurantParam) {
            console.log("Restaurant parameter is missing in the URL");
            return;
        }
        console.log("Restaurant Param: ", restaurantParam);

        const q = query(collection(db, "dishes"), where('dishDetail.restaurant', "==",restaurantParam ))
        // const a=collection(db,"dishes");
        const querySnapshot = await getDocs(q);
        pageSpinner.style.display="none";
        mainContent.style.display="block"

        // console.log("query",querySnapshot)
        // const firstDoc=querySnapshot.docs[0];
        // console.log("firstDoc",firstDoc.data().dishDetail.price)
        
    // console.log(q);
        const alldishes = document.getElementById("all-dishes");

        if (!alldishes) {
            console.error("Element with ID 'all-dishes' not found in the document.");
            return;
        }
        alldishes.innerHTML = "";
        let dishes=[];

        // const querySnapshot = await getDocs(q);
        // console.log(querySnapshot);

        if (querySnapshot.empty) {
            alldishes.innerHTML = "<p>No dishes found for this restaurant.</p>";
            return;
        }

        querySnapshot.forEach(doc => {

            const dish = doc.data().dishDetail;
            aDishes.push({...dish,id:doc.id});
            console.log(dish.restaurant);

            if (!dish) {
                console.warn(`Dish detail is missing for document with ID: ${doc.id}`);
                return;
            }

            alldishes.innerHTML += ` 
                <div class="card w-100 ">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <img src="${dish.image}" width="120px" class="dish-img">
                                <div class="px-3">
                                    <h3 class="card-title">${dish.name}</h3>
                                    <h5>${dish.price}/</h5>
                                    <p class="card-text">${dish.serving}</p>
                                </div>
                            </div>
                            <div>
                                <span>
                                    <i onclick="updateQuantity('+','${doc.id}')" class="fa-solid fa-plus border rounded-circle border-dark p-2"></i>
                                </span>
                                <span class="p-2 fw-bold fs-5" id=${doc.id}>1</span>
                                <span class="p-2">
                                    <i onclick="updateQuantity('-','${doc.id}')" class="fa-solid fa-minus border rounded-circle border-dark p-2"></i>
                                </span>
                                <a href="#" class="btn btn-primary add-to-cart mx-2" onclick="addToCart('${doc.id}')">Add to Cart</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Error fetching dishes: ", error);
    }
};

getallDishes();

const getRestaurantDetail=async()=>{
    const docRef = doc(db, "restaurants", urlParams.get('restaurant'));
const docSnap = await getDoc(docRef);
const resName=document.getElementById("res-name");
const resAddress=document.getElementById("res-address");
const resImage=document.getElementById("res-image");
if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  resName.innerHTML=docSnap.data().name;
  resAddress.innerHTML=docSnap.data().address;
  resImage.src=docSnap.data().image

} else {
  
  console.log("No such document!");
}
       
}
getRestaurantDetail();

const updateQuantity=(type,id)=>{
    const qty=document.getElementById(id);
    if(type==="+"){
        qty.innerHTML=Number(qty.innerHTML)+1;
    }
    else{
        if(qty.innerHTML>1){
            qty.innerHTML=Number(qty.innerHTML)-1;
        }
    }
    // console.log(id);
    // console.log(type);
}

window.updateQuantity=updateQuantity;


const addToCart=(id)=>{

    const cartItems=localStorage.getItem('cart');
    const cart=cartItems?JSON.parse(cartItems):[];
    const qty=document.getElementById(id);
const dish=aDishes.filter(v=> v.id===id);

console.log(id,qty.innerHTML);
cart.push({...dish[0],qty:Number(qty.innerHTML)});
localStorage.setItem('cart',JSON.stringify(cart));


const sum=cart.reduce((a,b)=>{
    return a+ Number(b.price)*b.qty;
},0)
const total_amount=document.getElementById("total_amount");
total_amount.innerHTML=`Rs ${sum+100}/-`;
console.log(sum);

getCartItems()


}
window.addToCart=addToCart;


const getCartItems=()=>{
    const cartItems=JSON.parse(localStorage.getItem('cart'));
    const cart=document.getElementById("cart")
    cart.innerHTML="";
    if(cartItems){
        for(let i=0;i<cartItems.length;i++){
       cart.innerHTML+=` <div class="card w-100 mb-3" >
                            <div class="card-body">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <img src="${cartItems[i].image}" width="120px" class="dish-img" alt="Dish">
                                        <div class="px-3">
                                            <h3 class="card-title">${cartItems[i].name}</h3>
                                            <h5>${cartItems[i].price}/- *${cartItems[i].qty}=${
                                                cartItems[i].price*cartItems[i].qty
                                            }</h5>
                                            <p class="card-text">${cartItems[i].serving}</p>
                                        </div>
                                    </div>
                                    <a href="#" class="btn btn-primary delete" onclick="deleteCartItems('${i}')"><i class="fa-solid fa-trash"></i></a>
                                </div>
                            </div>
                        </div>`
        }
    }
   
    


}

const deleteCartItems=(index)=>{
 console.log(index);
 const cartItems=JSON.parse(localStorage.getItem('cart'));
 cartItems.splice(index,1);
 localStorage.setItem('cart',JSON.stringify(cartItems));
 getCartItems();
 const sum=cartItems.reduce((a,b)=>{
    return a+ Number(b.price)*b.qty;
},0)
 const total_amount=document.getElementById("total_amount");
total_amount.innerHTML=`Rs ${sum+100}/-`;
console.log(sum);
 
}
window.deleteCartItems=deleteCartItems;
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
