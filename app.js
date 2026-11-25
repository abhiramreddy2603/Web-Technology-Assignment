// Educational front-end demo only. localStorage is NOT secure authentication or a real database.
const USERS_KEY="engineeringBookStoreUsers", CART_KEY="engineeringBookStoreCart";
const getUsers=()=>{try{return JSON.parse(localStorage.getItem(USERS_KEY))||[]}catch{return[]}};
const getCart=()=>{try{return JSON.parse(localStorage.getItem(CART_KEY))||[]}catch{return[]}};
function saveCart(cart){localStorage.setItem(CART_KEY,JSON.stringify(cart));updateCartCount()}
function updateCartCount(){const n=getCart().reduce((s,x)=>s+x.quantity,0);document.querySelectorAll(".cart-count").forEach(e=>e.textContent=n)}
document.addEventListener("DOMContentLoaded",()=>{
 updateCartCount();
 document.querySelectorAll(".add-to-cart").forEach(btn=>btn.addEventListener("click",()=>{
  const cart=getCart(),id=btn.dataset.id,found=cart.find(x=>x.id===id);
  if(found)found.quantity++;else cart.push({id,title:btn.dataset.title,price:Number(btn.dataset.price),quantity:1});
  saveCart(cart);btn.textContent="Added ✓";renderCart();
 }));
 const clear=document.getElementById("clear-cart");if(clear)clear.addEventListener("click",()=>{saveCart([]);renderCart()});
 function renderCart(){const box=document.getElementById("cart-items");if(!box)return;const cart=getCart(),total=cart.reduce((s,x)=>s+x.price*x.quantity,0);box.textContent=cart.length?cart.map(x=>`${x.title} × ${x.quantity} — ₹${x.price*x.quantity}`).join(" | "):"Your cart is empty.";document.getElementById("cart-total").textContent=cart.length?`Total: ₹${total}`:""}
 renderCart();
 const reg=document.getElementById("register-form");if(reg)reg.addEventListener("submit",e=>{
  e.preventDefault();const d=new FormData(reg),first=String(d.get("fname")).trim(),last=String(d.get("lname")).trim(),email=String(d.get("email")).trim().toLowerCase(),password=String(d.get("password")),mobile=String(d.get("mobile")).trim(),msg=document.getElementById("register-message");
  if(first.length<2||!last){msg.textContent="Enter a valid first and last name.";return}if(password.length<6){msg.textContent="Password must contain at least 6 characters.";return}if(!/^[0-9]{10}$/.test(mobile)){msg.textContent="Enter a valid 10-digit mobile number.";return}
  const users=getUsers();if(users.some(u=>u.email===email)){msg.textContent="Email already registered. Please login.";return}
  const loginId="BOOK"+Math.floor(100000+Math.random()*900000);users.push({loginId,first,last,email,password,address:d.get("address"),mobile});localStorage.setItem(USERS_KEY,JSON.stringify(users));msg.textContent=`Registration successful! Your Login ID is ${loginId}. Save it. You can now login.`;reg.reset();
 });
 const login=document.getElementById("login-form");if(login)login.addEventListener("submit",e=>{
  e.preventDefault();const id=document.getElementById("login-id").value.trim().toUpperCase(),pw=document.getElementById("password").value,user=getUsers().find(u=>u.loginId===id&&u.password===pw),msg=document.getElementById("login-message");msg.textContent=user?`Welcome, ${user.first}! Login successful.`:"Invalid Login ID or password. Register first if you do not have an account.";
 });
 const order=document.getElementById("cse-order-form");if(order)order.addEventListener("submit",e=>{
  e.preventDefault();const s=document.getElementById("cse-book"),o=s.options[s.selectedIndex],q=Number(document.getElementById("quantity").value),out=document.getElementById("order-result");if(!o.value||!Number.isInteger(q)||q<1||q>20){out.textContent="Choose a book and enter quantity from 1 to 20.";return}out.textContent=`${o.value}: ₹${o.dataset.price} × ${q} + ₹100 shipping = ₹${Number(o.dataset.price)*q+100}.`;
 });
});