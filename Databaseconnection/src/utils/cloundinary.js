import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
    // Configuration
    cloudinary.config({ 
        cloud_name:CLOUDINARY_CLOUD_NAME, 
        api_key:CLOUDINARY_API_KEY, 
        api_secret:CLOUDINARY_API_SECRET
    });
    
    const uploadOnCloudinary=async(localFilePath)=>{
        try{
            if(!localFilePath) return null
             const response=await cloudinary.uploader.upload(localFilePath,{
                resource_type:'auto'
            })
            //file has been uploader successfull
            console.log("file is uploaded in cloudinary" ,response.url)
            return response;
        }
        catch(error){
            fs.unlinkSync(localFilePath) //remove the locally save temporary file ad the upload operation got failed
        }
    }