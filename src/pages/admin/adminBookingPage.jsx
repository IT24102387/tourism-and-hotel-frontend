import axios from "axios";
import { useState, useEffect } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const[activOrder,setActiveOrder]=useState(null);
  const[modalOpened,setModalOpened]=useState(false);

  useEffect(() => {
    if (loading) {
      const token = localStorage.getItem("token");
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data)
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [loading]);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  function handleOrdersStatusChange(orderId,status){
    const token=localStorage.getItem("token");
    
    axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/orders/status/${orderId}`,
    {
      status:status
    },
    {
      headers:{
        Authorization:`Bearer ${token}`,

      },
    }
    ).then(()=>{
      setModalOpened(false)
      setLoading(true); //after update page reload
    }).catch((err)=>{
      console.error(err)
      setLoading(false)
  })
  }

  return (
    <div className="w-full p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">All Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr >
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Days</th>
              <th className="border px-4 py-2">Start Date</th>
              <th className="border px-4 py-2">End Date</th>
              <th className="border px-4 py-2">Total Amount</th>
              <th className="border px-4 py-2">Order Date</th>
              <th className="border px-4 py-2">Approval Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-center cursor-pointer" onClick={()=>{
                setActiveOrder(order);
                setModalOpened(true);
              }}>
                <td className="border px-4 py-2">{order.orderId}</td>
                <td className="border px-4 py-2">{order.email}</td>
                <td className="border px-4 py-2">{order.days}</td>
                <td className="border px-4 py-2">
                  {new Date(order.startingDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(order.endingDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">Rs. {order.totalAmount.toFixed(2)}</td>
                <td className="border px-4 py-2">
                  {new Date(order.orderDate).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {
        modalOpened &&(
            <div className="fixed top-0 left-0 w-full h-full bg-[#00000075] flex justify-center items-center">
                <div className="w-[500px] bg-white p-4 rounded-lg shadow-lg relative">
                  <IoMdCloseCircleOutline className="absolute top-2 right-2 text-3xl cursor-pointer hover:text-blue-700" onClick={()=>setModalOpened(false)}/>
                   <div className="flex flex-col gap-2" >
                    <h1 className="text-2xl font-semibold  mb-4">----Order Detais----</h1>
                    <p><span className="font-semibold">Order ID: </span>{activOrder.orderId}</p>
                    <p><span className="font-semibold">Email: </span>{activOrder.email}</p>
                    <p><span className="font-semibold">Days: </span>{activOrder.days}</p>
                    <p><span className="font-semibold">Starting Date: </span>{new Date(activOrder.startingDate).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Ending Date: </span>{new Date(activOrder.endingDate).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Total Amount: </span>{activOrder.totalAmount.toFixed(2)}</p>
                    <p><span className="font-semibold">Approval Status: </span>{activOrder.status}</p>
                    <p><span className="font-semibold">Order Date: </span>{new Date(activOrder.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div className="w-full flex  items-center my-5">
                      <button onClick={()=>{
                        handleOrdersStatusChange(activOrder.orderId,"Approved")

                      }} className="flex bg-green-500 text-white px-4 py-1 rounded-md">
                      Approve
                      </button>
                      <button onClick={()=>{
                        handleOrdersStatusChange(activOrder.orderId,"Rejected")
                      }} className="flex bg-red-500 text-white px-4 py-1 rounded-md ml-4">
                      Reject
                      </button>
                    </div>
                    <table className="w-full mt-4">
                      <thead>
                        <tr>
                          <th></th>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>PerDayPrice</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          activOrder.orderedItems.map((item)=>{
                            return(

                              <tr key={item.product.key}>
                                <td><img src={item.product.image} alt={item.product.name} className="w-10 h-10"/></td>
                                <td>{item.product.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.product.dailyRentalprice}</td>

                              </tr>
                            )
                          })
                        }
                        
                      </tbody>
                    </table>


                </div>
              
            </div>
        )
      }
    </div>
  );
}