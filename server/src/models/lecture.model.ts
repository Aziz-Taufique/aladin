import mongoose, {Document} from "mongoose";


interface ILecture extends Document {

}


const LectureSchema = new mongoose.Schema<ILecture>({
    
}, {timestamps: true})