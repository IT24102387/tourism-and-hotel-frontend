import {useState} from "react";
import imageUpload from "../utils/imageUpload";

export default function Testing(){
    const[file,setFile]=useState(null)

    function uploadFile(){
        console.log(file.name)
        imageUpload(file).then((url)=>{
            console.log(url)
        })

    }
    return(
        <div className="w-full flex flex-col justify-center items-center h-screen">
            <input type="file" onChange={(e)=>{setFile(e.target.files[0])}}/>
            <button onClick={uploadFile} className="w-[200px] h-[50px] bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-500 transition duration-200">
                Upload
            </button>
        </div>
    )

}