import { Link } from "react-router-dom";

export default function Header(){
    return(
        <header className="w-full h-[100px] shadow-xl flex justify-center items-center relative">
            <img src="/123.webp" alt="logo" className="w-[100px] h-[100px] object-cover absolute left-1 rounded-full " />
            <Link to="/" className="text-[25px] font-bold m-1">Home</Link> 
            <Link to="/gallery" className="text-[25px] font-bold m-1">gallery</Link>
            <Link to="/services" className="text-[25px] font-bold m-1">services</Link>
            <Link to="/contact" className="text-[25px] font-bold m-1">contact</Link>

        </header>
    )

}  