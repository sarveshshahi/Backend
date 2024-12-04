import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
  videoFile: {
    type: String, // cloudinary
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // cloudinary
    required: true,
  },
  views: {
    type: Number, // Corrected from 'number'
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: false, // Changed from 0 to false for clarity
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true }); // Corrected from 'timeStamps'

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
