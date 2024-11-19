import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import { request } from "express";
import {uploadOnCloudinary} from "../utils/cloundinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const regusterUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation- not empty
  //check if user already exists : username, email
  //check for image check for vatar
  //upload then to cloudinary avatr
  //create user object -create enty in db\
  //remove password and refresh token field from response
  //check for user creation
  //return response
  const { username, fullName, email, password } = req.body;
  console.log("email:", email);
  console.log("password", password);
  // if(fullName===""){
  //   throw new ApiError(400,"fullName is required")
  // }
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400,"all field are required")
  } 

 const existedUser= User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(409,"user with email or username already exists")
  }

  const avatarLocalPath=req.files?.avatar[0]?.path
  const coverImageLocalPath = req.file?.coverImage[0]?.path

  if(!avatarLocalPath){
    throw new ApiError(400,"avtar file is required")
  }

 const avatar =await uploadOnCloudinary(avatarLocalPath);


 const coverImage= await uploadOnCloudinary(coverImageLocalPath)

 if (!avatar){
  throw new ApiError(400,"avtar file is required")
 }
});

const user= await User.create({
  fullName,
  avatar:avtar.url,
  coverImage:coverImage?.url||"",
  email,
  password,
  username:username.toLowerCase()
})

const createdUser= await user.findById(user._id).select(
  '-password -refreshToken'
)
if(!createdUser){
  throw new ApiError(500,"something went worng while regestring user")
}

return res.status(201).json(
  new ApiResponse(200, createdUser,"user successfully created")
)
export { regusterUser };
