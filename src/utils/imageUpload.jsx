import { createClient } from "@supabase/supabase-js"  //connect code and supbase

const anon_key="sb_publishable_LNT20p1tPOu_HYOB6dqH2g_k3fbWuzB"
const supabase_url="https://bvkitmjiwmevssnkioab.supabase.co"

const supabase=createClient(supabase_url,anon_key)

export default function imageUpload(file){
    return new Promise((resolve,reject)=>{
        if(file==null){
            reject("No File selected")
        }


        const timestamp=new Date().getTime();
        const fileName=timestamp+file.name // add same image beacuse added timestamp


    supabase.storage.from("images").upload(fileName,file, {
        cacheControl:'3600',
        upsert:false,
    }).then(()=>{
        const publicUrl=supabase.storage.from("images").getPublicUrl(fileName).data.publicUrl;//get upload image url
        resolve(publicUrl)

     }).catch(()=>{
        reject("Error uploading file")
     })


 });

   
}//pass the file in the function