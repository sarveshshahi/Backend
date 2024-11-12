import mongoose ,{Schema, trusted} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoSchema=mongoose.Schema({
    videoFile:{
        type:String,//cloudnary
        required:true,

    },
    thumbnail:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number, //cloudanry
        required:true
    },
    views:{
        type:number,
        // required:true
        default:0,
    },
    isPublished:{
        type:Boolean,
        default:0
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timeStamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Videos=mongoose.model("Video",videoSchema)