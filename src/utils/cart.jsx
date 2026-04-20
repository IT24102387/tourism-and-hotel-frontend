import axios from "axios";

export function loadCart(){
    let cart=localStorage.getItem("cart");
    if(cart==null){
        cart={
            orderedItems:[],
            days:1,
            startingDate :formatDate(new Date()),
            endingDate:formatDate(new Date())
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        return cart;
    }
    return JSON.parse(cart);
}

// Add to cart — local only, no backend call
export function addToCart(key, qty){
    const cart=loadCart();
    let found=false;
    for(let i=0; i<cart.orderedItems.length; i++){
        if(cart.orderedItems[i].key == key){
            cart.orderedItems[i].qty += qty;
            found=true;
        }
    }
    if(!found){
        cart.orderedItems.push({key, qty});
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Decrease qty by 1 — local only, no backend call
export function decreaseCartQty(key){
    const cart=loadCart();
    for(let i=0; i<cart.orderedItems.length; i++){
        if(cart.orderedItems[i].key == key){
            cart.orderedItems[i].qty -= 1;
            if(cart.orderedItems[i].qty <= 0){
                cart.orderedItems.splice(i, 1);
            }
            break;
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Remove item entirely — local only, no backend call
export function removeFromCart(key){
    const cart=loadCart();
    cart.orderedItems=cart.orderedItems.filter(i => i.key != key);
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Called once on "Confirm & Create Booking" — decreases stock for all cart items
export async function commitStockToBackend(){
    const cart=loadCart();
    for(const item of cart.orderedItems){
        for(let i=0; i<item.qty; i++){
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/api/products/${item.key}/decrease-stock`
            );
        }
    }
}

export function formatDate(date){
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}