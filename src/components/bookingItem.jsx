import axios from "axios";
import { useEffect, useState } from "react";
import { addToCart, removeFromCart } from "../utils/cart";
import { FaArrowDown, FaArrowUp, FaTrash } from "react-icons/fa";

export default function BookingItem({ itemKey, qty, refresh }) {
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | success | error

  useEffect(() => {
    if (status === "loading") {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/products/${itemKey}`)
        .then((res) => {
          setItem(res.data);
          setStatus("success");
        })
        .catch((err) => {
          console.error(err);
          setStatus("error");
          refresh?.();
        });
    }
  }, [status, itemKey, refresh]);

  if (status === "loading") {
    return (
      <div className="flex w-[600px] gap-4 p-4 rounded-lg bg-[var(--color-highlight)] animate-pulse">
        <div className="w-20 h-20 rounded-md bg-gray-300" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 bg-gray-300 rounded" />
          <div className="h-3 w-1/3 bg-gray-300 rounded" />
        </div>
      </div>
    );
  }

  if (status === "error" || !item) return null;

  return (
    <div className="flex w-[600px] my-2 items-center gap-4 p-4 rounded-xl bg-[var(--color-primary)] shadow-sm border border-gray-200 relative">
      <div className="absolute right-[-45px] text-red-500 hover:text-white hover:bg-red-500 p-[10px] rounded-full cursor-pointer" >
      <FaTrash onClick={()=>{
          removeFromCart(itemKey);
          refresh();
      }}
      />
      </div>
      {/* Image */}
      <img
        src={item.image?.[0]}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg bg-[var(--color-highlight)]"
      />

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-blue-500">
          {item.name}
        </h3>
        <p className="text-xs text-gray-500">
          {item.category} 
        </p>

        <div className="mt-2 flex items-center gap-3 text-sm">
          <span className="text-gray-600 w-[100px]">
            Rs. {item.dailyRentalprice.toLocaleString()} / day
          </span>
          <span className="text-gray-400">×</span>
          <span className="font-medium w-[100px] text-center text-gray-800 relative flex justify-center items-center">
            <button
                className="absolute top-[-20px] hover:text-blue-500"
                onClick={()=>{
                    addToCart(itemKey,1);
                    refresh();
                }}
                >
                    <FaArrowUp/>
                </button>
                {qty}
                <button
                    className="absolute bottom-[-20px] hover:text-blue-500"
                    onClick={()=>{
                        
                          if(qty==1){
                            removeFromCart(itemKey);
                            refresh();
                          }else{
                            addToCart(itemKey, - 1);
                            refresh();
                          
                        }

                    }}
                >
                    <FaArrowDown/>
                </button>
            </span>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <p className="text-sm text-gray-500">Subtotal</p>
        <p className="font-semibold text-gray-900">
          Rs. {(item.dailyRentalprice.toFixed() * qty).toLocaleString()}
        </p>
      </div>
    </div>
  );
}