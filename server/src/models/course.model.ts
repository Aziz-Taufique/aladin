import mongoose,{Document, Model} from "mongoose";



interface ICourse extends Document {
    title: string
    description: string
    subtitle: string
    category: string
    level: string
    price: number,
    thumbnail: string
    enrolledStudents: mongoose.Schema.Types.ObjectId[]
    lectures: mongoose.Schema.Types.ObjectId[]
    instructor: mongoose.Schema.Types.ObjectId
    isPublished: boolean
    totalDuration: number
    totalLectures: number
}


const courseSchema = new mongoose.Schema<ICourse>({
    title: {
        type: String,
        required: [true, "Course title is required"],
        trim: true,
        maxLength: [100, "Course title cannot exceed 100 characters"]
    },
    subtitle: {
        type: String,
        trim: true,
        maxLength: [300, "Course subtitle cannot exceed 300 characters"]
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: [true, "Course category is required"],
        trim: true
    },
    level: {
        type: String,
        enum:{
            values:['beginner', 'intermediate', 'advanced'],
            message:'Please select a valid course level'
        },
        default: "beginner"
    },
    price: {
        type: Number,
        required: [true, "Course price is required"],
        min: [0, "Course price must be positive"]
    },
    thumbnail: {
        type: String,
        required: [true, "course thumbnail is required"]
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lecture"
        }
    ],
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true, 'Course instructor is required']
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    totalDuration:{
        type:Number,
        default:0
    },
    totalLectures:{
        type:Number,
        default:0
    }

}, {timestamps: true, toJSON:{virtuals:true}, toObject:{virtuals:true}})


courseSchema.virtual("averageRating").get(function(){
    return 0
})

courseSchema.pre("save", function(next){
    if(this.lectures){
        this.totalLectures = this.lectures.length
    }
    next()
})

const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema)

export default Course