import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res) => {
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
  console.log("mybody", req.body)
  console.log("email:", email);
  console.log("password", password);
  // if(fullName===""){
  //   throw new ApiError(400,"fullName is required")
  // }
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all field are required")
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  console.log("files",req.files)
  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;
  let coverImageLocalPath;

if (req.files?.coverImage && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
} else {
    coverImageLocalPath = null; // or any default value you prefer
}


  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }


  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  let avatar, coverImage;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar || !avatar.url) {
      throw new Error("Failed to upload avatar to Cloudinary");
    }
  } catch (error) {
    throw new ApiError(500, error.message || "Avatar upload failed");
  }

  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
  } catch (error) {
    coverImage = { url: "" }; // Default to empty if cover image upload fails
  }


  
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User successfully created")
  );
});

export { registerUser };
