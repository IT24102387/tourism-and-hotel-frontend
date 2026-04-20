import { Route, Routes } from "react-router-dom";
import Header from "../../components/header";
import Home from "./home";
import Services from "./services";
import Gallery from "./gallery";
import Contact from "./contact";
import ErrorNotFound from "./error";
import ProductOverview from "./productOverview";
import BookingPage from "./equipmentBookingPage";
import Reviews from "./reviews";
import PackageOverview from "../packages/packageOverview";
import PackagesPage from "../packages/packagesPage";
import MyBookings from "./myBookings";
import SafariVehicles from "./SafariVehicles";
import BookingDetails from "./VehicleBookingDetails";
import Restaurants from "./Restaurants";
import ResortRooms from "./Resortrooms";
import { RoomBookingFormPage, RoomDetailsPage } from "../rooms/BookingPages";
import GoogleMapsPage from "./GoogleMapsPage";


export default function HomePage(){
    return(
        <>
            <Header/>
            <div className="h-[calc(100vh-100px)] w-full bg-primary">
                <Routes path="/*">
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/gallery" element={<Gallery/>}/>
                    <Route path="/services" element={<Services/>}/>
                    <Route path="/booking" element={<BookingPage/>}/>
                    <Route path="/product/:key" element={<ProductOverview/>}/>
                    <Route path="/package/:packageId" element={<PackageOverview/>}/>
                    <Route path="/packages" element={<PackagesPage/>}/>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/*" element={<ErrorNotFound/>}/>
                    <Route path="/reviews" element={<Reviews/>} /> 
                    <Route path="/my-bookings" element={<MyBookings/>} />

                    <Route path="/safari-vehicles" element={<SafariVehicles />} />
                    <Route path="/booking-details" element={<BookingDetails />} />
                    <Route path="/restaurants"     element={<Restaurants />} />
                    

                    {/* rooms */}
                    <Route path="/rooms"                element={<ResortRooms />} />
                    <Route path="/rooms/:key/book"      element={<RoomBookingFormPage />} />
                    <Route path="/rooms/:key"           element={<RoomDetailsPage />} />

                    {/* googlemap */}
                    <Route path="/google-maps" element={<GoogleMapsPage />} /> {/* 👈 new route */}



                </Routes>
            </div>
        </>

        
        
    )

}