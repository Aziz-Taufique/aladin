import mongoose, {Document, Model} from "mongoose";

interface ILectureProgress extends Document {
    lecture: mongoose.Schema.Types.ObjectId
    isCompleted: boolean
    watchTime: number
    lastWatched: Date
}


const lectureProgressSchema  = new mongoose.Schema<ILectureProgress>({
    lecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    watchTime: {
        type: Number,
        default: 0
    },
    lastWatched: {
        type: Date,
        default: Date.now
    }
}, {timestamps:true})


const LectureProgress: Model<ILectureProgress> = mongoose.model<ILectureProgress>("LectureProgress", lectureProgressSchema)

export default LectureProgress