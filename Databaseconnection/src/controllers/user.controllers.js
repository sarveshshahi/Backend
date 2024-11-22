import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloundinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }

  } catch (error) {
    throw new ApiError(500, "something went wrong while generating access and refresh token")
  }
}


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

  console.log("files", req.files)
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

const loginUser = asyncHandler(async (req, res) => {
  //req  body=data
  //username and email
  //find the user
  //password
  //accesstoekn and refreshtoken token
  //send cookie
  const { email, username, password } = req.body
  // if (!username && !email) {
  //   throw new ApiError(400, "username or email and password is required")
  // }
  if (!(username || email)) {
    throw new ApiError(400, "username or email and password is required")
  }
  const user = await User.findOne({ $or: [{ username }, { email }] })
  if (!user) {
    throw new ApiError(404, "user dose not exist")
  }

  const isPasswordVaild = await user.isPasswordCorrect(password)

  if (!isPasswordVaild) {
    throw new ApiError(401, " invalid user credentials")
  }
  const { accessToken, refreshToken } = await
    generateAccessAndRefreshToken(user._id)

  const loggedUser = await User.findById(user._id).select("-password -refreshToken")

  //coocies
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options) // Corrected here
    .json(
      new ApiResponse(
        200,
        {
          user: loggedUser,
          accessToken,
          refreshToken
        },
        "User logged in Successfully"
      )
    );




})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }


  )

  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out"))
})


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorised request")
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedRefreshToken?._id)
    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "RefreshToken is expried")
    }
    const options = {
      httpOnly: true,
      secure: true
    }
    const { accessToken, newRefeshToken } = await generateAccessAndRefreshToken(user._id)
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefeshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefeshToken },
          "access Token Refeshed"
        )
      )
  } catch (error) {
    new ApiError(401, error?.message || "invalid refesh token")

  }
})


export { registerUser, loginUser, logoutUser, refreshAccessToken };
