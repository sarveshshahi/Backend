import {asyncHandler} from "../utils/asyncHandler.js"

const regusterUser =asyncHandler(async (req,res)=>{
    res.status(200).json({
        message:'ok'
    })
})
 
export {regusterUser}