import mongoose, {Document, Model} from "mongoose";


interface ILecture extends Document {
    title: string,
    description?: string
    videoUrl: string,
    duration: number
    publicId: string,
    isPreview: boolean
    order: number
}


const lectureSchema = new mongoose.Schema<ILecture>({
    title:{
        type: String,
        required: [true, "Lecture title is required"],
        trim: true,
        maxlength: [100, "Lecture title cannot exceed 100 characters"]
    },
    description:{
        type: String,
        trim: true,
        maxlength: [400, "Lecture description cannot exceed 400 characters"]
    },
    videoUrl: {
        type: String,
        required: [true, "Video url is required"]
    },
    duration: {
        type: Number,
        default: 0
    },
    publicId: {
        type: String,
        required: [true, 'Public ID is required for video management']
    },
    isPreview: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        required: [true, "Lecture order is required"]
    }

}, {timestamps: true, toJSON: {virtuals: true}, toObject:{virtuals:true}})

lectureSchema.pre("save", function(next){
    if(this.duration){
        this.duration = Math.round(this.duration * 100)/100
    }
    next()
})


const Lecture: Model<ILecture> = mongoose.model<ILecture>("Lecture", lectureSchema)

export default Lecture