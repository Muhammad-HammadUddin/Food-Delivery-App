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
    serverTimestamp,
    doc,
    getDoc,
    updateDoc
    ,signOut
  } from "./firebase.js";
  
  const placeOrder = document.getElementById("placeorder");
  let updateOrderId;
  
  placeOrder && placeOrder.addEventListener('click', async function (e) {
    const closebtn = document.getElementById("close_btn");
    const cartdiv = document.getElementById("cart");
    const name = document.getElementById("Name");
    const contact = document.getElementById("Contact");
    const address = document.getElementById("Address");
  
    console.log(name.value, contact.value, address.value);
  
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    console.log(cart);
  
    const sum = cart.reduce((a, b) => {
      return a + Number(b.price) * b.qty;
    }, 0);
  
    const orderDetails = {
      customerName: name.value,
      customerAddress: address.value,
      customerContact: contact.value,
      status: "pending",
      cart,
      orderAmount: sum,
      timestamp: serverTimestamp(),
      deliveryCharges: 100,
      totalAmount: sum + 100,
    };
  
    try {
      const docRef = await addDoc(collection(db, "orders"), orderDetails);
      console.log("Document written with ID: ", docRef.id);
  
      // Resetting the form
      name.value = "";
      address.value = "";
      contact.value = "";
      localStorage.removeItem("cart");
      cartdiv.innerHTML = "";
  
      const total_amount = document.querySelector("#total_amount");
      if (total_amount) total_amount.innerHTML = "";
  
      closebtn.click();
  
      Swal.fire({
        position: "center-center",
        icon: "success",
        title: "Your order has been placed",
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("There was an issue placing your order. Please try again.");
    }
  });
  
  const getallorders = async () => {
    let allorders = document.getElementById("all-orders");
    const q = collection(db, "orders");
    let index = 0;
    allorders.innerHTML ='';
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(element => {
      index++;
      let status = element.data().status;
      let statusColor = status === "pending" ? "bg-warning" : "bg-success"; // Corrected class names
  
      allorders.innerHTML += `
          <tr>
              <th scope="row">${index}</th>
              <td>${element.data().customerName}</td>
              <td>${element.data().customerContact}</td>
              <td>${element.data().customerAddress}</td>
              <td>
                  <span class="badge ${statusColor}">
                      ${element.data().status}
                  </span>
              </td>
              <td>${element.data().totalAmount}</td>
              <td>
                  <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="viewcartdetails('${element.id}')">
                    View Details
                  </button>
              </td>
          </tr>`;
    });
  
    const main_content = document.getElementById("main-content");
    const pageSpinner = document.getElementById("page-spinner");
    pageSpinner.style.display = 'none';
    main_content.style.display = 'block';
  };
  
  const viewcartdetails = async (id) => {
    updateOrderId = id;
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    const cart = document.getElementById("cart");
  
    const cartItems = docSnap.data().cart;
    cart.innerHTML = "";
    for (let i = 0; i < cartItems.length; i++) {
      cart.innerHTML += ` 
      <div class="card w-100 mb-3">
        <div class="card-body">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <img src="${cartItems[i].image}" width="120px" class="dish-img" alt="Dish">
              <div class="px-3">
                <h3 class="card-title">${cartItems[i].name}</h3>
                <h5>${cartItems[i].price}/- *${cartItems[i].qty} = ${
                  cartItems[i].price * cartItems[i].qty
                }</h5>
                <p class="card-text">${cartItems[i].serving}</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    }
  };
  getallorders();
  window.viewcartdetails = viewcartdetails;
  
  const updateOrder = document.getElementById("update_order");
  if (updateOrder) {
    updateOrder.addEventListener("click", async function () {
      const orderStatus = document.getElementById("order_status");
      console.log(updateOrderId);
      const docRef = doc(db, "orders", updateOrderId);
      await updateDoc(docRef, {
        status: orderStatus.value,
      });
      const close_btn = document.getElementById("close_btn");
      close_btn.click();
      getallorders();
    });
  }
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